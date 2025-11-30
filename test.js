// 파일 경로: WBP-SDK/test.js

const { WbpSdk } = require('./src/index.js');

console.log("WBP-SDK 로컬 테스트를 시작합니다...");
console.log("------------------------------------");

const sdk = new WbpSdk({ 
    apiKey: 'DUMMY_API_KEY_FOR_TESTING',
    environment: 'sandbox' 
});

// [중요] 이번에는 정확한 56자 지갑 주소로 테스트합니다.
const testPiAddress = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

async function runTest() {
    try {
        console.log(`[시도] '${testPiAddress}' 주소의 잔액을 Netlify 서버에 조회합니다...`);
        
        const result = await sdk.wallets.getBalance(testPiAddress);
        
        console.log("\n✅ 테스트 성공!");
        console.log("   서버로부터 받은 응답:", result);
        console.log("------------------------------------");
        console.log("이제 파트너사 개발자들도 동일한 경험을 할 수 있습니다.");

    } catch (error) {
        console.error("\n❌ 테스트 실패!");
        console.error("   오류 메시지:", error.message);
        console.log("------------------------------------");
        console.log("WBP-SDK/src/index.js 또는 Netlify 함수에 문제가 없는지 확인해주세요.");
    }
}

runTest();