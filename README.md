# WBP SDK v1.0.0 (Software Development Kit)

[![NPM Version](https://img.shields.io/npm/v/wbp-sdk.svg)](https://www.npmjs.com/package/wbp-sdk)
[![GitHub license](https://img.shields.io/github/license/WorldBanksPi/WBP-SDK)](https://github.com/WorldBanksPi/WBP-SDK/blob/main/LICENSE)

The official **WorldBanksPi (WBP) SDK** enables DApps and online merchants on the Pi Network to accept non-custodial Pi & WBP payments, verify real-time webhooks, check on-chain balances, and distribute WBP tokens safely with idempotency protection.

## Features
- **CommonJS & ESM Dual Support** + Full **TypeScript Definitions (`src/index.d.ts`)**
- **Merchant Checkout (`sdk.payments.createCheckout`)**: Generate hosted payment links & QR codes with auto-filled WorldBanksPi checkout UI
- **Webhook Verification (`WbpSdk.verifyWebhookSignature`)**: Constant-time `HMAC-SHA256` signature check
- **Idempotent Payouts (`sdk.transactions.send`)**: `idempotencyKey` prevents double-spends on network retries
- **Combined Balances (`sdk.wallets.getBalances`)**: Fetch Pi + WBP balances and on-chain activation status in one call
- **Automatic Retry**: Exponential backoff on transient 5xx/network errors for read endpoints

## Installation

```bash
npm install wbp-sdk
```

## Quick Start

```javascript
// CommonJS
const { WbpSdk } = require('wbp-sdk');
// or ESM:
// import { WbpSdk } from 'wbp-sdk';

const sdk = new WbpSdk({
    apiKey: process.env.WBP_API_KEY,
    environment: 'sandbox' // 'sandbox' (Pi Testnet) or 'production' (Pi Mainnet)
});

// 1. Create a Merchant Checkout Session
const { checkout } = await sdk.payments.createCheckout({
    orderId: 'ORDER-2026-001',
    amount: '10',
    assetType: 'pi', // 'pi' or 'wbp'
    recipientAddress: 'G...56CHARS',
    returnUrl: 'https://your-shop.com/complete',
    webhookUrl: 'https://your-shop.com/api/webhooks/wbp'
});
console.log('Redirect customer to:', checkout.checkoutUrl);

// 2. Verify Webhook Signature (Express example)
const valid = WbpSdk.verifyWebhookSignature(rawBody, req.headers['x-wbp-signature'], webhookSecret);

// 3. Check Pi + WBP Balances
const balances = await sdk.wallets.getBalances('G...56CHARS');

// 4. Send WBP Reward (with Idempotency Key)
const tx = await sdk.transactions.send({
    recipient: 'G...56CHARS',
    amount: '25.5',
    idempotencyKey: 'reward_order_2026_001'
});
```

See **[examples/express-shop.js](./examples/express-shop.js)** for a complete 5-minute merchant integration, and **[docs/03-api-reference.md](./docs/03-api-reference.md)** for full API specs.

---

# WBP SDK v1.0.0 (소프트웨어 개발 키트)

**WorldBanksPi(WBP) 공식 SDK**는 파이 네트워크 기반 DApp 및 가맹점이 비수탁형 Pi/WBP 결제창(Checkout), 실시간 웹훅 검증, 온체인 잔액 조회, 이중 출금 방지 토큰 전송을 단 몇 줄의 코드로 연동할 수 있게 해줍니다.

## 주요 기능
- **CommonJS(`require`) + ESM(`import`) 동시 지원** 및 **TypeScript 타입 내장**
- **가맹점 결제 세션 생성 (`sdk.payments.createCheckout`)**: 결제 URL·QR 발급 → 고객이 WorldBanksPi에서 지문 한 번으로 결제 완료
- **웹훅 서명 검증 (`WbpSdk.verifyWebhookSignature`)**: `HMAC-SHA256` 상수 시간 비교로 위조 요청 원천 차단
- **이중 출금 방지 (`idempotencyKey`)**: `sdk.transactions.send()` 재전송 시 중복 송금 차단
- **Pi + WBP 통합 잔액 조회 (`sdk.wallets.getBalances`)** 및 **조회 요청 자동 재시도**

## 5분 가맹점 연동 예제
전체 실행 예제는 **[examples/express-shop.js](./examples/express-shop.js)** 를 참고하세요.

## 라이선스
MIT License.
