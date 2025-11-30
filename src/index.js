// 파일명: src/index.js

// 외부 서버와 통신(API 호출)을 쉽게 할 수 있도록 도와주는 라이브러리입니다.
const axios = require('axios');

// 개발 환경(sandbox)과 실제 운영 환경(production)의 API 서버 주소를 미리 정의합니다.
const ENVIRONMENTS = {
    sandbox: 'https://worldbankspi.netlify.app/sdk/v1',    // 개발 및 테스트용 가상 서버 주소
    production: 'https://worldbankspi.netlify.app/sdk/v1'  // 실제 서비스용 서버 주소
};

/**
 * WorldBanksPi 플랫폼과 연동하기 위한 메인 SDK 클래스입니다.
 */
class WbpSdk {
    /**
     * SDK를 초기화합니다.
     * @param {object} config - SDK 설정 객체
     * @param {string} config.apiKey - 파트너 포털에서 발급받은 고유 API 키
     * @param {('sandbox'|'production')} [config.environment='production'] - API 환경 (기본값: production)
     */
    constructor(config) {
        // API 키가 없으면 SDK를 초기화할 수 없으므로 에러를 발생시킵니다.
        if (!config || !config.apiKey) {
            throw new Error('API 키는 SDK를 초기화하는 데 필수 항목입니다.');
        }

        this.apiKey = config.apiKey;
        this.environment = config.environment || 'production';
        
        // API 통신을 위한 '전용 클라이언트'를 생성합니다.
        // 모든 요청에 기본 주소와 인증 헤더가 자동으로 포함됩니다.
        this.client = axios.create({
            baseURL: ENVIRONMENTS[this.environment],
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        });

        // 기능별로 API를 그룹화하여 (wallets, transactions 등) 사용 편의성을 높입니다.
        this.wallets = {
            /**
             * 특정 사용자의 WBP 잔액을 조회합니다.
             * @param {string} piAddress - 조회할 사용자의 파이 지갑 주소 (G...)
             * @returns {Promise<object>} 잔액 정보가 담긴 객체
             */
            getBalance: async (piAddress) => {
                if (!piAddress || !piAddress.startsWith('G')) {
                    throw new Error('유효한 파이 지갑 주소를 입력해야 합니다.');
                }
                try {
                    // 위에서 만든 client를 사용하여 실제 API를 호출합니다.
                    const response = await this.client.get(`/wallets/${piAddress}/balance`);
                    return response.data; // 성공 시 서버가 보내준 JSON 데이터를 반환합니다.
                } catch (error) {
                    // API 호출 실패 시, 표준화된 에러 처리를 위해 _handleError 함수를 호출합니다.
                    // 여기서 'this'는 WbpSdk 클래스 인스턴스를 가리킵니다.
                    throw this._handleError(error);
                }
            }
        };

        this.transactions = {
            // 향후 여기에 WBP 전송, 교환 등 거래 관련 함수들이 추가될 예정입니다.
        };

        // [기술적 안정성 보강]
        // wallets.getBalance 함수 내부에서 사용되는 'this'가 항상 WbpSdk 클래스 자신을
        // 가리키도록 강제로 고정(bind)합니다. 이는 예기치 못한 'this' 관련 에러를 방지합니다.
        this.wallets.getBalance = this.wallets.getBalance.bind(this);
    }

    /**
     * API 에러를 표준화된 형식으로 처리하는 내부 헬퍼 함수입니다.
     * @private
     */
    _handleError(error) {
        // 서버가 구체적인 에러 메시지를 보내준 경우
        if (error.response && error.response.data && error.response.data.message) {
            return new Error(error.response.data.message);
        } 
        // 서버가 응답 자체를 하지 못한 경우 (네트워크 문제 등)
        else if (error.request) {
            return new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
        } 
        // 그 외의 예기치 못한 오류
        else {
            return new Error(`요청 처리 중 예기치 못한 오류가 발생했습니다: ${error.message}`);
        }
    }
}

// 다른 파일에서 `const { WbpSdk } = require('wbp-sdk');` 형태로 사용할 수 있도록 클래스를 공개합니다.
module.exports = { WbpSdk };