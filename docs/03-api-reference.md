# 3. API Reference (WBP SDK v1.0.0)

---

### `sdk.wallets.getBalance(piAddress)`
Retrieves the WBP balance for a 56-character Pi/Stellar address (`G...`).

### `sdk.wallets.getBalances(piAddress)`
Retrieves both Pi and WBP balances plus on-chain activation status (`exists`).

### `sdk.payments.createCheckout(params)`
Creates a 30-minute hosted checkout session (`chk_...`) and returns `checkoutUrl` & `qrData`.
- `orderId` (`string`, optional)
- `amount` (`string | number`, required, > 0)
- `assetType` (`'pi' | 'wbp'`, default `'wbp'`)
- `recipientAddress` (`string`, 56-char `G...`)
- `memo` (`string`, optional, max 28 bytes)
- `returnUrl` (`string`, optional, `https://` or `http://localhost`)
- `webhookUrl` (`string`, optional, `https://` or `http://localhost`)
- `metadata` (`object`, optional)

### `sdk.payments.getCheckout(checkoutId)`
Queries the current status (`pending` | `completed` | `expired`), `paymentId`, and `txHash` of a checkout session.

### `sdk.payments.get(paymentId)`
Verifies a non-custodial WBP Payment (`wbp_...`) status and on-chain `txHash`.

### `sdk.transactions.send({ recipient, amount, idempotencyKey })`
Transfers WBP tokens (App-to-User). Supplying `idempotencyKey` guarantees at-most-once execution even on network retries.

### `WbpSdk.verifyWebhookSignature(rawBody, signatureHeader, webhookSecret)`
Verifies the `X-WBP-Signature` (`sha256=...`) header on incoming `payment.completed` webhooks using `crypto.timingSafeEqual`.
