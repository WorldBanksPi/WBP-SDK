// 파일명: src/index.js (WBP-SDK v1.0.0)

const crypto = require('crypto');
const axios = require('axios');

const ENVIRONMENTS = {
    sandbox: 'https://worldbankspidev.netlify.app/sdk/v1',
    production: 'https://worldbankspi.netlify.app/sdk/v1'
};

const PI_PUBLIC_KEY_REGEX = /^G[A-Z2-7]{55}$/;
const PAYMENT_ID_REGEX = /^wbp_[a-f0-9]{16,32}$/;
const CHECKOUT_ID_REGEX = /^chk_[a-f0-9]{16,32}$/;

function assertValidPiAddress(piAddress) {
    if (typeof piAddress !== 'string' || !PI_PUBLIC_KEY_REGEX.test(piAddress.trim())) {
        throw new Error('유효한 파이/스텔라 공개 지갑 주소(G로 시작하는 56자리)를 입력해야 합니다.');
    }
    return piAddress.trim();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 가맹점 서버에서 WorldBanksPi 웹훅(X-WBP-Signature)의 위조 여부를 검증합니다.
 * @param {string|Buffer} rawBody - 원문 HTTP 요청 본문 문자열
 * @param {string} signatureHeader - 요청 헤더 'x-wbp-signature' ('sha256=...')
 * @param {string} webhookSecret - 가맹점 웹훅 시크릿 (또는 파트너 API 키)
 * @returns {boolean}
 */
function verifyWebhookSignature(rawBody, signatureHeader, webhookSecret) {
    if (!rawBody || !signatureHeader || !webhookSecret) return false;
    const expected = 'sha256=' + crypto
        .createHmac('sha256', String(webhookSecret))
        .update(Buffer.isBuffer(rawBody) ? rawBody : String(rawBody), 'utf8')
        .digest('hex');

    const a = Buffer.from(String(signatureHeader).trim(), 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

/**
 * WorldBanksPi 플랫폼과 연동하기 위한 공식 SDK 클래스입니다 (v1.0.0).
 */
class WbpSdk {
    /**
     * @param {object} config
     * @param {string} config.apiKey - 파트너 고유 API 키
     * @param {('sandbox'|'production')} [config.environment='production']
     * @param {string} [config.baseUrl] - 커스텀 API URL (선택)
     * @param {number} [config.timeout=15000] - 요청 타임아웃(ms)
     * @param {number} [config.maxRetries=2] - GET 조회 요청 일시 오류 시 자동 재시도 횟수
     */
    constructor(config) {
        if (!config || !config.apiKey || typeof config.apiKey !== 'string') {
            throw new Error('API 키는 SDK를 초기화하는 데 필수 항목입니다.');
        }

        const env = config.environment || 'production';
        if (!ENVIRONMENTS[env]) {
            throw new Error(`유효하지 않은 environment 값입니다: '${env}'. 'sandbox' 또는 'production'을 사용하세요.`);
        }

        this.apiKey = config.apiKey.trim();
        this.environment = env;
        this.isSandbox = env === 'sandbox';
        this.maxRetries = typeof config.maxRetries === 'number' && config.maxRetries >= 0 ? config.maxRetries : 2;
        this.baseUrl = (config.baseUrl && typeof config.baseUrl === 'string')
            ? config.baseUrl.replace(/\/+$/, '')
            : ENVIRONMENTS[env];

        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: typeof config.timeout === 'number' && config.timeout > 0 ? config.timeout : 15000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        });

        this.wallets = {
            /**
             * 특정 사용자의 WBP 단일 잔액을 조회합니다.
             */
            getBalance: async (piAddress) => {
                const addr = assertValidPiAddress(piAddress);
                return this._getWithRetry(`/wallets/${addr}/balance`, { isSandbox: this.isSandbox });
            },

            /**
             * 특정 사용자의 Pi 및 WBP 통합 잔액과 지갑 개통 여부를 조회합니다.
             */
            getBalances: async (piAddress) => {
                const addr = assertValidPiAddress(piAddress);
                return this._getWithRetry(`/wallets/${addr}/balances`, { isSandbox: this.isSandbox });
            }
        };

        this.transactions = {
            /**
             * 사용자에게 WBP 토큰을 전송합니다 (App-to-User).
             * idempotencyKey를 넘기면 네트워크 재전송 시 이중 출금을 완벽히 방지합니다.
             */
            send: async (params) => {
                if (!params || typeof params !== 'object') {
                    throw new Error('전송 파라미터 객체가 필요합니다.');
                }
                const targetAddr = assertValidPiAddress(params.recipientPublicKey || params.recipient);
                const numericAmount = Number(params.amount);
                if (!isFinite(numericAmount) || numericAmount <= 0) {
                    throw new Error('유효한 전송 수량(0보다 큰 숫자)을 입력해야 합니다.');
                }

                const headers = {};
                if (params.idempotencyKey && typeof params.idempotencyKey === 'string') {
                    headers['Idempotency-Key'] = params.idempotencyKey.trim();
                }

                try {
                    const response = await this.client.post('/transactions', {
                        recipientPublicKey: targetAddr,
                        amount: numericAmount.toFixed(7),
                        idempotencyKey: headers['Idempotency-Key'] || undefined,
                        isSandbox: this.isSandbox
                    }, { headers });
                    return response.data;
                } catch (error) {
                    throw this._handleError(error);
                }
            }
        };

        this.payments = {
            /**
             * 외부 가맹점 결제 세션(Checkout)을 생성하고 결제 페이지 링크/QR 데이터를 발급합니다.
             */
            createCheckout: async (params) => {
                if (!params || typeof params !== 'object') {
                    throw new Error('Checkout 파라미터 객체가 필요합니다.');
                }
                const assetType = String(params.assetType || 'wbp').toLowerCase();
                if (assetType !== 'pi' && assetType !== 'wbp') {
                    throw new Error("assetType은 'pi' 또는 'wbp'만 지원합니다.");
                }
                const numericAmount = Number(params.amount);
                if (!isFinite(numericAmount) || numericAmount <= 0) {
                    throw new Error('유효한 결제 금액(0보다 큰 숫자)이 필요합니다.');
                }
                if (params.recipientAddress) {
                    assertValidPiAddress(params.recipientAddress);
                }

                try {
                    const response = await this.client.post('/payments/checkout', {
                        orderId: params.orderId || undefined,
                        amount: numericAmount.toFixed(7),
                        assetType,
                        recipientAddress: params.recipientAddress ? params.recipientAddress.trim() : undefined,
                        memo: params.memo || undefined,
                        returnUrl: params.returnUrl || undefined,
                        webhookUrl: params.webhookUrl || undefined,
                        metadata: params.metadata || undefined,
                        isSandbox: this.isSandbox
                    });
                    return response.data;
                } catch (error) {
                    throw this._handleError(error);
                }
            },

            /**
             * 가맹점 Checkout 세션(chk_...)의 결제 상태 및 TxHash를 조회합니다.
             */
            getCheckout: async (checkoutId) => {
                if (typeof checkoutId !== 'string' || !CHECKOUT_ID_REGEX.test(checkoutId.trim())) {
                    throw new Error('유효한 checkoutId(chk_...)를 입력해야 합니다.');
                }
                return this._getWithRetry(`/payments/checkout/${checkoutId.trim()}`, { isSandbox: this.isSandbox });
            },

            /**
             * 비수탁형 WBP 페이먼트 결제 건(wbp_...)의 상태 및 온체인 TxHash를 검증합니다.
             */
            get: async (paymentId) => {
                if (typeof paymentId !== 'string' || !PAYMENT_ID_REGEX.test(paymentId.trim())) {
                    throw new Error('유효한 WBP paymentId(wbp_...)를 입력해야 합니다.');
                }
                return this._getWithRetry(`/payments/${paymentId.trim()}`, { isSandbox: this.isSandbox });
            }
        };

        this.wallets.getBalance = this.wallets.getBalance.bind(this);
        this.wallets.getBalances = this.wallets.getBalances.bind(this);
        this.transactions.send = this.transactions.send.bind(this);
        this.payments.createCheckout = this.payments.createCheckout.bind(this);
        this.payments.getCheckout = this.payments.getCheckout.bind(this);
        this.payments.get = this.payments.get.bind(this);
    }

    /**
     * 조회(GET) 요청에 대해 일시적 네트워크/5xx 오류 시 자동 재시도합니다.
     * @private
     */
    async _getWithRetry(path, params) {
        let lastError = null;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await this.client.get(path, { params });
                return response.data;
            } catch (error) {
                lastError = error;
                const status = error.response ? error.response.status : 0;
                const isRetryable = !status || status >= 500 || status === 429;
                if (!isRetryable || attempt === this.maxRetries) {
                    throw this._handleError(error);
                }
                await sleep(300 * Math.pow(2, attempt));
            }
        }
        throw this._handleError(lastError);
    }

    /**
     * API 에러를 표준화된 형식으로 처리합니다.
     * @private
     */
    _handleError(error) {
        if (error && error.response && error.response.data) {
            const msg = error.response.data.message || `API 요청 실패 (HTTP ${error.response.status})`;
            const err = new Error(msg);
            err.statusCode = error.response.status;
            err.responseData = error.response.data;
            return err;
        }
        if (error && error.code === 'ECONNABORTED') {
            return new Error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
        }
        if (error && error.request) {
            return new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        }
        return new Error(`요청 처리 중 예기치 못한 오류가 발생했습니다: ${error ? error.message : 'Unknown error'}`);
    }
}

WbpSdk.verifyWebhookSignature = verifyWebhookSignature;

module.exports = { WbpSdk, ENVIRONMENTS, verifyWebhookSignature };
