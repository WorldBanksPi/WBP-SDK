
# WBP SDK (Software Development Kit)

[![NPM Version](https://img.shields.io/npm/v/wbp-sdk.svg)](https://www.npmjs.com/package/wbp-sdk)
[![License](https://img.shields.io/npm/l/wbp-sdk.svg)](https://github.com/WorldBanksPi/WBP-SDK/blob/main/LICENSE)

The **WorldBanksPi (WBP) SDK** is a developer toolkit that enables other DApps within the Pi Network ecosystem to easily integrate with WorldBanksPi's powerful financial infrastructure and the WBP Token economy.

## Installation

Install the SDK via Node Package Manager (NPM):

```bash
npm install wbp-sdk
```

## Quick Start

```javascript
const { WbpSdk } = require('wbp-sdk');

// Initialize the SDK with your API Key
const sdk = new WbpSdk({ 
    apiKey: 'YOUR_API_KEY',
    environment: 'sandbox' 
});

// Get a user's balance
async function checkUserBalance(piAddress) {
    try {
        const result = await sdk.wallets.getBalance(piAddress);
        console.log(`Balance: ${result.balance} WBP`);
    } catch (error) {
        console.error(error.message);
    }
}

checkUserBalance('G...');
```

## Documentation

For detailed guides and API references, please see our **[Official Developer Docs](./docs/01-introduction.md)**.

## License

This SDK is licensed under the MIT License.

---------------------------



# WBP SDK (소프트웨어 개발 키트)

[![NPM Version](https://img.shields.io/npm/v/wbp-sdk.svg)](https://www.npmjs.com/package/wbp-sdk)
[![License](https://img.shields.io/npm/l/wbp-sdk.svg)](https://github.com/WorldBanksPi/WBP-SDK/blob/main/LICENSE)

**WorldBanksPi(WBP) SDK**는 파이 네트워크(Pi Network) 생태계의 다른 앱(DApp)들이 WorldBanksPi의 강력한 금융 인프라와 WBP 토큰 이코노미를 자신의 서비스에 쉽게 통합할 수 있도록 돕는 개발자용 도구 상자입니다.

## 설치

NPM(Node Package Manager)을 통해 쉽게 설치할 수 있습니다.

```bash
npm install wbp-sdk
```

## 빠른 시작 (Quick Start)

```javascript
const { WbpSdk } = require('wbp-sdk');

// 당신의 API 키로 SDK를 초기화합니다.
const sdk = new WbpSdk({ 
    apiKey: 'YOUR_API_KEY',
    environment: 'sandbox' 
});

// 사용자의 잔액을 조회합니다.
async function checkUserBalance(piAddress) {
    try {
        const result = await sdk.wallets.getBalance(piAddress);
        console.log(`잔액: ${result.balance} WBP`);
    } catch (error) {
        console.error(error.message);
    }
}

checkUserBalance('G...');
```

## 개발자 문서

더 상세한 가이드와 API 레퍼런스는 **[공식 개발자 문서](./docs/01-introduction.md)**를 참고해 주십시오.

## 라이선스

본 SDK는 MIT 라이선스를 따릅니다.

---------------------------