# WBP SDK (Software Development Kit)

[![NPM Version](https://img.shields.io/npm/v/wbp-sdk.svg)](https://www.npmjs.com/package/wbp-sdk)
[![GitHub license](https://img.shields.io/github/license/WorldBanksPi/WBP-SDK)](https://github.com/WorldBanksPi/WBP-SDK/blob/main/LICENSE)

The **WorldBanksPi (WBP) SDK** is a developer toolkit that enables other DApps within the Pi Network ecosystem to easily integrate with WorldBanksPi's powerful financial infrastructure and the WBP Token economy.

> **Note:** This SDK is currently in the final stages of preparation for its official NPM release. The installation and usage examples below reflect the final intended usage. For current integration, please refer to our temporary API documentation.

## Installation

Install the SDK via Node Package Manager (NPM):

```bash
npm install wbp-sdk
```

## Configuration

Before making any requests, you must configure the SDK with your provided API Key and the desired environment.

```javascript
const { WbpSdk } = require('wbp-sdk');

// Initialize the SDK
const sdk = new WbpSdk({ 
    apiKey: 'YOUR_PARTNER_API_KEY', // Provided by the WorldBanksPi team
    environment: 'sandbox' // 'sandbox' for Testnet, 'production' for Mainnet
});
```

*   `apiKey` (required): Your secret key for authenticating requests.
*   `environment` (required): Specifies the target network. Use `'sandbox'` for the Pi Testnet and `'production'` for the Pi Mainnet.

## Quick Start: Get Balance

Retrieve the WBP token balance for a given Pi wallet address.

```javascript
async function checkUserBalance(piAddress) {
    try {
        const result = await sdk.wallets.getBalance(piAddress);
        console.log(`Network: ${result.network}`);
        console.log(`Balance: ${result.balance} ${result.asset}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
checkUserBalance('GBQQ...5678');
```

## Quick Start: Send Tokens

Transfer WBP tokens to a user. This is an App-to-User (A2U) transaction.

```javascript
async function sendReward(recipientAddress, amountToSend) {
    try {
        const result = await sdk.transactions.send({
            recipient: recipientAddress,
            amount: amountToSend // Amount as a string
        });
        console.log('Transaction submitted successfully!');
        console.log('Tx Hash:', result.hash);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example usage
sendReward('GBQQ...5678', '123.45');
```

## Documentation

For detailed guides and API references, please see our **[Official Developer Docs](./docs/01-introduction.md)**.

## License

This SDK is licensed under the MIT License.

---
<br>

# WBP SDK (소프트웨어 개발 키트)

[![NPM Version](https://img.shields.io/npm/v/wbp-sdk.svg)](https://www.npmjs.com/package/wbp-sdk)
[![GitHub license](https://img.shields.io/github/license/WorldBanksPi/WBP-SDK)](https://github.com/WorldBanksPi/WBP-SDK/blob/main/LICENSE)

**WorldBanksPi(WBP) SDK**는 파이 네트워크(Pi Network) 생태계의 다른 앱(DApp)들이 WorldBanksPi의 강력한 금융 인프라와 WBP 토큰 이코노미를 자신의 서비스에 쉽게 통합할 수 있도록 돕는 개발자용 도구 상자입니다.

> **안내:** 본 SDK는 현재 정식 NPM 배포를 위한 마지막 준비 단계에 있습니다. 아래의 설치 및 사용법 예시는 최종 버전을 기준으로 작성되었습니다. 현재 연동을 위해서는 임시 API 문서를 참고해주십시오.

## 설치

NPM(Node Package Manager)을 통해 쉽게 설치할 수 있습니다.

```bash
npm install wbp-sdk
```

## 환경 설정

모든 기능을 사용하기 전에, 발급받은 API 키와 사용하려는 네트워크 환경으로 SDK를 초기화해야 합니다.

```javascript
const { WbpSdk } = require('wbp-sdk');

// SDK 초기화
const sdk = new WbpSdk({ 
    apiKey: 'YOUR_PARTNER_API_KEY', // WorldBanksPi 팀으로부터 발급받은 API 키
    environment: 'sandbox' // 테스트넷은 'sandbox', 메인넷은 'production'
});
```

*   `apiKey` (필수): 요청 인증을 위한 비밀 키입니다.
*   `environment` (필수): 대상 네트워크를 지정합니다. 파이 테스트넷은 `'sandbox'`, 파이 메인넷은 `'production'`을 사용합니다.

## 빠른 시작: 잔액 조회

지정된 파이 지갑 주소의 WBP 토큰 잔액을 조회합니다.

```javascript
async function checkUserBalance(piAddress) {
    try {
        const result = await sdk.wallets.getBalance(piAddress);
        console.log(`네트워크: ${result.network}`);
        console.log(`잔액: ${result.balance} ${result.asset}`);
    } catch (error) {
        console.error('오류:', error.message);
    }
}

// 사용 예시
checkUserBalance('GBQQ...5678');
```

## 빠른 시작: 토큰 전송

사용자에게 WBP 토큰을 전송합니다. 이 기능은 앱이 사용자에게 자산을 지급(App-to-User)하는 트랜잭션입니다.

```javascript
async function sendReward(recipientAddress, amountToSend) {
    try {
        const result = await sdk.transactions.send({
            recipient: recipientAddress,
            amount: amountToSend // 금액은 반드시 문자열(string) 형태여야 합니다.
        });
        console.log('트랜잭션이 성공적으로 제출되었습니다!');
        console.log('Tx 해시:', result.hash);
    } catch (error) {
        console.error('오류:', error.message);
    }
}

// 사용 예시
sendReward('GBQQ...5678', '123.45');
```

## 개발자 문서

더 상세한 가이드와 API 레퍼런스는 **[공식 개발자 문서](./docs/01-introduction.md)**를 참고해 주십시오.

## 라이선스

본 SDK는 MIT 라이선스를 따릅니다.