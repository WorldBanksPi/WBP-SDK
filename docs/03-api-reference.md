# 3. API Reference

This section provides a detailed reference for all available WBP SDK v0.2.0 methods.

---

### `sdk.wallets.getBalance(piAddress)`

Retrieves the WBP token balance for a specific wallet address.

**Parameters:**
- `piAddress` (`string`, required): 56-character Pi/Stellar public key (`G...`).

**Example Response:**
```json
{
  "success": true,
  "asset": "WBP",
  "balance": "1234.5678000",
  "network": "testnet"
}
```

---

### `sdk.wallets.getBalances(piAddress)`

Retrieves both Pi and WBP balances along with on-chain activation status (`exists`).

**Parameters:**
- `piAddress` (`string`, required): 56-character Pi/Stellar public key (`G...`).

**Example Response:**
```json
{
  "success": true,
  "address": "G...",
  "exists": true,
  "balances": {
    "pi": "99.9900000",
    "wbp": "1234.5678000"
  },
  "network": "testnet"
}
```

---

### `sdk.transactions.send({ recipient, amount })`

Transfers WBP tokens from the partner/distributor gateway to a user wallet (App-to-User).

**Parameters:**
- `recipient` or `recipientPublicKey` (`string`, required): Recipient 56-character public key (`G...`).
- `amount` (`string | number`, required): Positive WBP amount.

**Example Response:**
```json
{
  "success": true,
  "message": "토큰 전송이 성공적으로 제출되었습니다.",
  "hash": "a1b2c3...",
  "network": "testnet"
}
```

---

### `sdk.payments.get(paymentId)`

Verifies the status and on-chain `txHash` of a non-custodial WBP Payment.

**Parameters:**
- `paymentId` (`string`, required): Payment ID starting with `wbp_`.

**Example Response:**
```json
{
  "success": true,
  "payment": {
    "paymentId": "wbp_1234567890abcdef",
    "status": "completed",
    "network": "testnet",
    "senderAddress": "G...",
    "recipientAddress": "G...",
    "assetType": "pi",
    "amount": "1.0000000",
    "txHash": "f4e5d6...",
    "createdAt": "2026-11-25T00:00:00.000Z",
    "completedAt": "2026-11-25T00:00:12.000Z"
  }
}
```

---

# 3. API 레퍼런스

WBP SDK v0.2.0에서 제공하는 전체 메서드 레퍼런스입니다.

---

### `sdk.wallets.getBalance(piAddress)`
지정된 지갑 주소의 WBP 단일 잔액을 조회합니다. (`piAddress`: `G`로 시작하는 56자리 공개키)

### `sdk.wallets.getBalances(piAddress)`
지정된 지갑 주소의 **Pi + WBP 통합 잔액**과 온체인 개통 여부(`exists`)를 한 번에 조회합니다.

### `sdk.transactions.send({ recipient, amount })`
사용자에게 WBP 토큰을 전송합니다 (`recipient` 또는 `recipientPublicKey` 모두 지원).

### `sdk.payments.get(paymentId)`
비수탁형 WBP 페이먼트(`wbp_...`)의 승인·완료 상태(`status`)와 온체인 `txHash`를 서버에서 안전하게 검증합니다.
