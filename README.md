# WBP SDK (Software Development Kit)

[![NPM Version](https://img.shields.io/npm/v/wbp-sdk.svg)](https://www.npmjs.com/package/wbp-sdk)
[![GitHub license](https://img.shields.io/github/license/WorldBanksPi/WBP-SDK)](https://github.com/WorldBanksPi/WBP-SDK/blob/main/LICENSE)

The **WorldBanksPi (WBP) SDK** is a developer toolkit that enables DApps and merchants within the Pi Network ecosystem to integrate with WorldBanksPi's financial infrastructure, WBP Token economy, and non-custodial WBP Payments.

## Installation

```bash
npm install wbp-sdk
```

## Configuration

```javascript
const { WbpSdk } = require('wbp-sdk');

const sdk = new WbpSdk({
    apiKey: process.env.WBP_API_KEY, // Provided by the WorldBanksPi team
    environment: 'sandbox',          // 'sandbox' (Pi Testnet) or 'production' (Pi Mainnet)
    timeout: 15000                   // Optional: request timeout in ms (default: 15000)
});
```

* `apiKey` (required): Partner secret API key for Bearer authentication.
* `environment` (optional): `'sandbox'` for Pi Testnet (`isSandbox=true`) or `'production'` for Pi Mainnet (default: `'production'`).
* `baseUrl` (optional): Custom API base URL override.
* `timeout` (optional): HTTP timeout in milliseconds (default: `15000`).

## Quick Start

### 1. Get WBP Balance (`sdk.wallets.getBalance`)
```javascript
const result = await sdk.wallets.getBalance('G...56CHARS');
console.log(result);
// { success: true, asset: 'WBP', balance: '100.0000000', network: 'testnet' }
```

### 2. Get Pi + WBP Combined Balances (`sdk.wallets.getBalances`)
```javascript
const result = await sdk.wallets.getBalances('G...56CHARS');
console.log(result);
// { success: true, address: 'G...', exists: true, balances: { pi: '12.5000000', wbp: '100.0000000' }, network: 'testnet' }
```

### 3. Send WBP Tokens (`sdk.transactions.send`)
```javascript
const result = await sdk.transactions.send({
    recipient: 'G...56CHARS', // or recipientPublicKey
    amount: '12.5'
});
console.log('Tx Hash:', result.hash);
```

### 4. Verify Non-Custodial WBP Payment (`sdk.payments.get`)
```javascript
const result = await sdk.payments.get('wbp_1234567890abcdef');
if (result.payment.status === 'completed') {
    console.log('Verified on-chain TxHash:', result.payment.txHash);
}
```

## Documentation

See **[Official Developer Docs](./docs/01-introduction.md)** and **[API Reference](./docs/03-api-reference.md)**.

## License

MIT License.

---

# WBP SDK (소프트웨어 개발 키트)

**WorldBanksPi(WBP) SDK**는 파이 네트워크(Pi Network) 생태계의 DApp 및 가맹점이 WorldBanksPi의 금융 인프라, WBP 토큰 이코노미, 비수탁형 WBP 페이먼트를 쉽게 연동할 수 있도록 돕는 공식 개발자 키트입니다.

## 설치

```bash
npm install wbp-sdk
```

## 환경 설정

```javascript
const { WbpSdk } = require('wbp-sdk');

const sdk = new WbpSdk({
    apiKey: process.env.WBP_API_KEY, // WorldBanksPi 팀 발급 파트너 API 키
    environment: 'sandbox',          // 'sandbox'(테스트넷) 또는 'production'(메인넷)
    timeout: 15000                   // 선택: 요청 타임아웃(ms, 기본값 15000)
});
```

## 빠른 시작

### 1. WBP 단일 잔액 조회 (`sdk.wallets.getBalance`)
```javascript
const result = await sdk.wallets.getBalance('G...56자리주소');
console.log(`네트워크: ${result.network}, 잔액: ${result.balance} ${result.asset}`);
```

### 2. Pi + WBP 통합 잔액 조회 (`sdk.wallets.getBalances`)
```javascript
const result = await sdk.wallets.getBalances('G...56자리주소');
console.log(`개통 여부: ${result.exists}, Pi: ${result.balances.pi}, WBP: ${result.balances.wbp}`);
```

### 3. WBP 토큰 전송 (`sdk.transactions.send`)
```javascript
const result = await sdk.transactions.send({
    recipient: 'G...56자리주소', // 또는 recipientPublicKey
    amount: '12.5'
});
console.log('Tx 해시:', result.hash);
```

### 4. 비수탁형 WBP 페이먼트 결제 검증 (`sdk.payments.get`)
```javascript
const result = await sdk.payments.get('wbp_1234567890abcdef');
if (result.payment.status === 'completed') {
    console.log('온체인 확정 TxHash:', result.payment.txHash);
}
```

## 개발자 문서

상세 가이드는 **[공식 개발자 문서](./docs/01-introduction.md)** 및 **[API 레퍼런스](./docs/03-api-reference.md)**를 참고해 주십시오.

## 라이선스

MIT License.
