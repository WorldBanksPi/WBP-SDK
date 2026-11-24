// 파일명: src/index.js

const axios = require('axios');

const ENVIRONMENTS = {
    sandbox: 'https://worldbankspidev.netlify.app/sdk/v1',
    production: 'https://worldbankspi.netlify.app/sdk/v1'
};

const PI_PUBLIC_KEY_REGEX = /^G[A-Z2-7]{55}$/;
const PAYMENT_ID_REGEX = /^wbp_[a-f0-9]{16,32}$/;

function assertValidPiAddress(piAddress) {
    if (typeof piAddress !== 'string' || !PI_PUBLIC_KEY_REGEX.test(piAddress.trim())) {
        throw new Error('유효한 파이/스텔라 공개 지갑 주소(G로 시작하는 56자리)를 입력해야 합니다.');
    }
    return piAddress.trim();
}

/**
 * WorldBanksPi 플랫폼과 연동하기 위한 공식 SDK 클래스입니다.
 */
class WbpSdk {
    /**
     * SDK를 초기화합니다.
     * @param {object} config - SDK 설정 객체
     * @param {string} config.apiKey - 파트너 포털에서 발급받은 고유 API 키
     * @param {('sandbox'|'production')} [config.environment='production'] - API 환경
     * @param {string} [config.baseUrl] - 커스텀 API 베이스 URL (선택)
     * @param {number} [config.timeout=15000] - 요청 타임아웃(ms)
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
             * @param {string} piAddress - 조회할 파이 지갑 주소 (G..., 56자)
             * @returns {Promise<object>}
             */
            getBalance: async (piAddress) => {
                const addr = assertValidPiAddress(piAddress);
                try {
                    const response = await this.client.get(`/wallets/${addr}/balance`, {
                        params: { isSandbox: this.isSandbox }
                    });
                    return response.data;
                } catch (error) {
                    throw this._handleError(error);
                }
            },

            /**
             * 특정 사용자의 Pi 및 WBP 통합 잔액과 지갑 개통 여부를 조회합니다.
             * @param {string} piAddress - 조회할 파이 지갑 주소 (G..., 56자)
             * @returns {Promise<object>}
             */
            getBalances: async (piAddress) => {
                const addr = assertValidPiAddress(piAddress);
                try {
                    const response = await this.client.get(`/wallets/${addr}/balances`, {
                        params: { isSandbox: this.isSandbox }
                    });
                    return response.data;
                } catch (error) {
                    throw this._handleError(error);
                }
            }
        };

        this.transactions = {
            /**
             * 사용자에게 WBP 토큰을 전송합니다 (App-to-User).
             * @param {object} params
             * @param {string} [params.recipient] - 수취인 지갑 주소 (G..., 56자)
             * @param {string} [params.recipientPublicKey] - 수취인 지갑 주소 (recipient 별칭)
             * @param {string|number} params.amount - 전송할 WBP 수량 (0 초과)
             * @returns {Promise<object>}
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

                try {
                    const response = await this.client.post('/transactions', {
                        recipientPublicKey: targetAddr,
                        amount: numericAmount.toFixed(7),
                        isSandbox: this.isSandbox
                    });
                    return response.data;
                } catch (error) {
                    throw this._handleError(error);
                }
            }
        };

        this.payments = {
            /**
             * 비수탁형 WBP 페이먼트 결제 건의 상태 및 온체인 TxHash를 검증합니다.
             * @param {string} paymentId - WBP 결제 ID (wbp_...)
             * @returns {Promise<object>}
             */
            get: async (paymentId) => {
                if (typeof paymentId !== 'string' || !PAYMENT_ID_REGEX.test(paymentId.trim())) {
                    throw new Error('유효한 WBP paymentId(wbp_...)를 입력해야 합니다.');
                }
                const cleanId = paymentId.trim();
                try {
                    const response = await this.client.get(`/payments/${cleanId}`, {
                        params: { isSandbox: this.isSandbox }
                    });
                    return response.data;
                } catch (error) {
                    throw this._handleError(error);
                }
            }
        };

        this.wallets.getBalance = this.wallets.getBalance.bind(this);
        this.wallets.getBalances = this.wallets.getBalances.bind(this);
        this.transactions.send = this.transactions.send.bind(this);
        this.payments.get = this.payments.get.bind(this);
    }

    /**
     * API 에러를 표준화된 형식으로 처리합니다.
     * @private
     */
    _handleError(error) {
        if (error.response && error.response.data) {
            const msg = error.response.data.message || `API 요청 실패 (HTTP ${error.response.status})`;
            const err = new Error(msg);
            err.statusCode = error.response.status;
            err.responseData = error.response.data;
            return err;
        }
        if (error.code === 'ECONNABORTED') {
            return new Error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
        }
        if (error.request) {
            return new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        }
        return new Error(`요청 처리 중 예기치 못한 오류가 발생했습니다: ${error.message}`);
    }
}

module.exports = { WbpSdk, ENVIRONMENTS };
