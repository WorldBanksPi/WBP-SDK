/**
 * WorldBanksPi WBP-SDK v1.0.0 - 5-Minute Express Merchant Integration Example
 *
 * Dependencies: npm install express wbp-sdk
 * Env vars: WBP_API_KEY, WBP_WEBHOOK_SECRET, MERCHANT_WALLET_ADDRESS
 */

const express = require('express');
const { WbpSdk } = require('wbp-sdk'); // or: import { WbpSdk } from 'wbp-sdk';

const app = express();

const sdk = new WbpSdk({
    apiKey: process.env.WBP_API_KEY,
    environment: process.env.WBP_ENV || 'sandbox' // 'sandbox' or 'production'
});

// 1) Create a checkout session when a customer clicks "Pay with Pi / WBP"
app.post('/api/orders/checkout', express.json(), async (req, res) => {
    try {
        const { orderId, amount, assetType = 'pi' } = req.body;
        const result = await sdk.payments.createCheckout({
            orderId,
            amount,
            assetType,
            recipientAddress: process.env.MERCHANT_WALLET_ADDRESS,
            memo: `Order #${orderId}`,
            returnUrl: 'https://your-shop.com/order-complete',
            webhookUrl: 'https://your-shop.com/api/webhooks/wbp',
            metadata: { orderId }
        });

        // Redirect customer to result.checkout.checkoutUrl or render result.checkout.qrData as a QR code
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

// 2) Receive & verify real-time payment completion webhook from WorldBanksPi
app.post('/api/webhooks/wbp', express.raw({ type: 'application/json' }), (req, res) => {
    const signature = req.headers['x-wbp-signature'];
    const isValid = WbpSdk.verifyWebhookSignature(
        req.body,
        signature,
        process.env.WBP_WEBHOOK_SECRET || process.env.WBP_API_KEY
    );

    if (!isValid) {
        return res.status(401).json({ error: 'Invalid WBP webhook signature' });
    }

    const event = JSON.parse(req.body.toString('utf8'));
    if (event.event === 'payment.completed') {
        console.log(`Order ${event.orderId} paid! TxHash: ${event.txHash}`);
        // TODO: Mark order as paid in your database
    }

    res.json({ received: true });
});

// 3) Optional: Send WBP reward to customer with idempotency protection (prevents double-spend)
app.post('/api/rewards/send', express.json(), async (req, res) => {
    try {
        const { userWallet, amount, rewardId } = req.body;
        const result = await sdk.transactions.send({
            recipient: userWallet,
            amount,
            idempotencyKey: `reward_${rewardId}`
        });
        res.json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Merchant server listening on http://localhost:3000');
});
