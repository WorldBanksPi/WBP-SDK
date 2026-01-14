// File Path: WBP-SDK/test.js

const { WbpSdk } = require('./src/index.js');

// ========================================================================
// --- [ Partner Test Configuration Area ] ---
// To run a local test, please modify the 3 items below with your information.
// ========================================================================

// 1. API Key: Enter the API key issued to you by the WorldBanksPi team.
const YOUR_API_KEY = 'PASTE_YOUR_API_KEY_HERE';

// 2. Test Wallet Address: Enter a valid Pi wallet address to check the balance.
const YOUR_TEST_WALLET_ADDRESS = 'PASTE_YOUR_TEST_WALLET_ADDRESS_HERE';

// 3. Test Environment: Choose either 'sandbox' (for Testnet) or 'production' (for Mainnet).
const YOUR_TEST_ENVIRONMENT = 'sandbox'; 

// ========================================================================
// --- Test Script (No modification needed below this line) ---
// ========================================================================

console.log("====================================");
console.log("🚀 Starting WBP-SDK Local Connection Test...");
console.log("====================================");

// Validate configuration
if (YOUR_API_KEY === 'PASTE_YOUR_API_KEY_HERE' || YOUR_TEST_WALLET_ADDRESS === 'PASTE_YOUR_TEST_WALLET_ADDRESS_HERE') {
    console.error("\n❌ Configuration Error: Please modify YOUR_API_KEY and YOUR_TEST_WALLET_ADDRESS at the top of the test.js file first.");
    console.log("------------------------------------");
    process.exit(1); // Exit the test if not configured
}

// Initialize SDK with the configuration
const sdk = new WbpSdk({ 
    apiKey: YOUR_API_KEY,
    environment: YOUR_TEST_ENVIRONMENT 
});

async function runTest() {
    try {
        console.log(`[Environment: ${YOUR_TEST_ENVIRONMENT}]`);
        console.log(`[Attempting] Querying balance for address '${YOUR_TEST_WALLET_ADDRESS.substring(0, 10)}...'`);
        
        // Call the getBalance API
        const result = await sdk.wallets.getBalance(YOUR_TEST_WALLET_ADDRESS);
        
        console.log("\n✅ Test Successful!");
        console.log("   Response from server:", result);
        console.log("------------------------------------");
        console.log("Congratulations! You can now integrate the WBP-SDK into your application.");

    } catch (error) {
        console.error("\n❌ Test Failed!");
        console.error("   Error Message:", error.message);
        console.log("------------------------------------");
        console.log("Please check if your API Key, Wallet Address, and Environment are correct.");
        console.log("If the problem persists, please contact the WorldBanksPi team.");
    }
}

runTest();

// ------------------------------------------------------------------------
// --- 한글 버전 (Korean Version) ---
// ------------------------------------------------------------------------
/*
const { WbpSdk } = require('./src/index.js');

// ========================================================================
// --- [ 파트너사 테스트 설정 영역 ] ---
// 로컬 테스트를 실행하려면, 아래 3개 항목을 당신의 정보로 수정하세요.
// ========================================================================

// 1. API 키: WorldBanksPi 팀으로부터 발급받은 파트너용 API 키를 입력하세요.
const YOUR_API_KEY = 'PASTE_YOUR_API_KEY_HERE';

// 2. 테스트 지갑 주소: 잔액을 조회할 유효한 Pi 지갑 주소를 입력하세요.
const YOUR_TEST_WALLET_ADDRESS = 'PASTE_YOUR_TEST_WALLET_ADDRESS_HERE';

// 3. 테스트 환경: 'sandbox' (테스트넷) 또는 'production' (메인넷) 중 하나를 선택하세요.
const YOUR_TEST_ENVIRONMENT = 'sandbox'; 

// ========================================================================
// --- 테스트 스크립트 (이 아래는 수정할 필요 없습니다) ---
// ========================================================================

console.log("====================================");
console.log("🚀 WBP-SDK 로컬 연결 테스트를 시작합니다...");
console.log("====================================");

// 설정 값 검증
if (YOUR_API_KEY === 'PASTE_YOUR_API_KEY_HERE' || YOUR_TEST_WALLET_ADDRESS === 'PASTE_YOUR_TEST_WALLET_ADDRESS_HERE') {
    console.error("\n❌ 설정 오류: test.js 파일 상단의 YOUR_API_KEY 와 YOUR_TEST_WALLET_ADDRESS 를 먼저 수정해주세요.");
    console.log("------------------------------------");
    process.exit(1);
}

// 설정된 값으로 SDK 초기화
const sdk = new WbpSdk({ 
    apiKey: YOUR_API_KEY,
    environment: YOUR_TEST_ENVIRONMENT 
});

async function runTest() {
    try {
        console.log(`[환경: ${YOUR_TEST_ENVIRONMENT}]`);
        console.log(`[시도] '${YOUR_TEST_WALLET_ADDRESS.substring(0, 10)}...' 주소의 잔액을 조회합니다...`);
        
        // 잔액 조회 API 호출
        const result = await sdk.wallets.getBalance(YOUR_TEST_WALLET_ADDRESS);
        
        console.log("\n✅ 테스트 성공!");
        console.log("   서버로부터 받은 응답:", result);
        console.log("------------------------------------");
        console.log("축하합니다! 이제 당신의 애플리케이션에 WBP-SDK를 연동할 수 있습니다.");

    } catch (error) {
        console.error("\n❌ 테스트 실패!");
        console.error("   오류 메시지:", error.message);
        console.log("------------------------------------");
        console.log("API 키, 지갑 주소, 네트워크 환경이 올바른지 확인해주세요.");
        console.log("문제가 지속되면 WorldBanksPi 팀에 문의해주세요.");
    }
}

runTest();
*/