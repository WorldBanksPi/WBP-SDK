// File Path: WBP-SDK/test.js

const { WbpSdk } = require('./src/index.js');

// ========================================================================
// --- [ Partner Test Configuration Area ] ---
// To run a local test, modify the items below or set env vars:
//   WBP_API_KEY, WBP_TEST_WALLET, WBP_TEST_ENV
// ========================================================================

const YOUR_API_KEY = process.env.WBP_API_KEY || 'PASTE_YOUR_API_KEY_HERE';
const YOUR_TEST_WALLET_ADDRESS = process.env.WBP_TEST_WALLET || 'PASTE_YOUR_TEST_WALLET_ADDRESS_HERE';
const YOUR_TEST_ENVIRONMENT = process.env.WBP_TEST_ENV || 'sandbox'; // 'sandbox' or 'production'
const OPTIONAL_PAYMENT_ID = process.env.WBP_TEST_PAYMENT_ID || '';

// ========================================================================
// --- Test Script ---
// ========================================================================

console.log('====================================');
console.log('🚀 Starting WBP-SDK v0.2.0 Connection Test...');
console.log('====================================');

if (YOUR_API_KEY === 'PASTE_YOUR_API_KEY_HERE' || YOUR_TEST_WALLET_ADDRESS === 'PASTE_YOUR_TEST_WALLET_ADDRESS_HERE') {
    console.error('\n❌ Configuration Error: Please set YOUR_API_KEY and YOUR_TEST_WALLET_ADDRESS first.');
    process.exit(1);
}

const sdk = new WbpSdk({
    apiKey: YOUR_API_KEY,
    environment: YOUR_TEST_ENVIRONMENT
});

async function runTest() {
    try {
        console.log(`[Environment: ${sdk.environment}] baseUrl: ${sdk.baseUrl}`);

        console.log('\n1) Testing sdk.wallets.getBalance()...');
        const singleRes = await sdk.wallets.getBalance(YOUR_TEST_WALLET_ADDRESS);
        console.log('   Result:', singleRes);

        console.log('\n2) Testing sdk.wallets.getBalances() (Pi + WBP)...');
        const combinedRes = await sdk.wallets.getBalances(YOUR_TEST_WALLET_ADDRESS);
        console.log('   Result:', combinedRes);

        if (OPTIONAL_PAYMENT_ID) {
            console.log('\n3) Testing sdk.payments.get()...');
            const paymentRes = await sdk.payments.get(OPTIONAL_PAYMENT_ID);
            console.log('   Result:', paymentRes);
        }

        console.log('\n✅ All WBP-SDK tests passed!');
    } catch (error) {
        console.error('\n❌ Test Failed!');
        console.error('   Status:', error.statusCode || 'N/A');
        console.error('   Error Message:', error.message);
        process.exit(1);
    }
}

runTest();
