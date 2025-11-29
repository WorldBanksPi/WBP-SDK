
# 4. Code Examples

This section provides complete, ready-to-use examples for common use cases.

### Example: Checking a User's Balance via a Web Server

This example demonstrates how you might use the SDK in an Express.js server to create an API endpoint that checks a user's balance.

**File: `server.js`**
```javascript
const express = require('express');
const { WbpSdk } = require('wbp-sdk');
require('dotenv').config(); // Use dotenv to load environment variables from a .env file

const app = express();
const port = 3000;

// Initialize the SDK once when the server starts
const sdk = new WbpSdk({ 
    apiKey: process.env.WBP_API_KEY,
    environment: 'sandbox'
});

// Create a route to handle balance check requests
app.get('/user-balance/:piAddress', async (req, res) => {
    const { piAddress } = req.params;

    if (!piAddress) {
        return res.status(400).json({ success: false, message: 'piAddress parameter is required.' });
    }

    try {
        const balanceData = await sdk.wallets.getBalance(piAddress);
        res.status(200).json(balanceData);
    } catch (error) {
        // The SDK's built-in error handler standardizes the error message
        res.status(400).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Example server listening at http://localhost:${port}`);
    console.log(`Try accessing: http://localhost:3000/user-balance/G...`);
});
```

------------------------------


# 4. 코드 예제

이 섹션은 일반적인 사용 사례에 대해 바로 복사해서 사용할 수 있는 완전한 코드 예제를 제공합니다.

### 예제: 웹 서버를 통해 사용자 잔액 확인하기

이 예제는 Express.js 서버에서 SDK를 사용하여 사용자 잔액을 확인하는 API 엔드포인트를 만드는 방법을 보여줍니다.

**파일명: `server.js`**
```javascript
const express = require('express');
const { WbpSdk } = require('wbp-sdk');
require('dotenv').config(); // .env 파일로부터 환경 변수를 불러오기 위해 dotenv 사용

const app = express();
const port = 3000;

// 서버가 시작될 때 SDK를 한 번만 초기화합니다.
const sdk = new WbpSdk({ 
    apiKey: process.env.WBP_API_KEY,
    environment: 'sandbox'
});

// 잔액 조회 요청을 처리할 라우트(API 경로)를 생성합니다.
app.get('/user-balance/:piAddress', async (req, res) => {
    const { piAddress } = req.params;

    if (!piAddress) {
        return res.status(400).json({ success: false, message: 'piAddress 파라미터가 필요합니다.' });
    }

    try {
        const balanceData = await sdk.wallets.getBalance(piAddress);
        res.status(200).json(balanceData);
    } catch (error) {
        // SDK에 내장된 에러 핸들러가 오류 메시지를 표준화해줍니다.
        res.status(400).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`예제 서버가 다음 주소에서 실행 중입니다: http://localhost:${port}`);
    console.log(`예시: http://localhost:3000/user-balance/G...`);
});
```

------------------------------