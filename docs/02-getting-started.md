
# 2. Getting Started

Follow these steps to start integrating the WBP SDK into your application's backend server.

### Step 1: Obtain an API Key

Before you can use the SDK, you must register as a partner on the WorldBanksPi platform.

1.  Visit the **[WorldBanksPi Partner Portal](https://worldbankspi.netlify.app/partnership)**.
2.  Submit your application with details about your project.
3.  Once approved, you will be issued API Keys for both `sandbox` and `production` environments.

> **Security Notice:** Your API Key is a secret. Do not expose it in any client-side code or commit it to version control.

### Step 2: Install the SDK

Install the package from NPM into your project:

```bash
npm install wbp-sdk
```

### Step 3: Initialize the SDK

Import and initialize the `WbpSdk` class in your code, providing your API Key. It's recommended to load the key from environment variables.

```javascript
const { WbpSdk } = require('wbp-sdk');

const sdk = new WbpSdk({ 
    apiKey: process.env.WBP_API_KEY,
    environment: 'sandbox' // Use 'sandbox' for testing, 'production' for live
});

----------------------


# 2. 시작하기

아래 단계에 따라 WBP SDK를 당신의 애플리케이션 백엔드 서버에 연동하는 작업을 시작할 수 있습니다.

### 1단계: API 키 발급받기

SDK를 사용하기 전, WorldBanksPi 플랫폼에 파트너로 등록해야 합니다.

1.  **[WorldBanksPi 파트너 포털](https://worldbankspi.netlify.app/partnership)**에 방문합니다.
2.  당신의 프로젝트에 대한 상세 내용과 함께 파트너십 신청서를 제출합니다.
3.  승인이 완료되면, `sandbox`(테스트용)와 `production`(실서버용) 환경에서 사용할 수 있는 API 키가 발급됩니다.

> **보안 안내:** API 키는 비밀 정보입니다. 절대로 클라이언트 측 코드에 노출하거나 버전 관리 시스템(Git 등)에 커밋해서는 안 됩니다.

### 2단계: SDK 설치하기

NPM을 사용하여 프로젝트에 패키지를 설치합니다.

```bash
npm install wbp-sdk
```

### 3단계: SDK 초기화하기

당신의 코드에서 `WbpSdk` 클래스를 불러와 API 키를 사용하여 초기화합니다. API 키는 환경 변수(.env)에서 불러오는 것을 권장합니다.

```javascript
const { WbpSdk } = require('wbp-sdk');

const sdk = new WbpSdk({ 
    apiKey: process.env.WBP_API_KEY,
    environment: 'sandbox' // 개발 및 테스트 시에는 'sandbox', 실제 서비스에서는 'production' 사용
});

----------------------