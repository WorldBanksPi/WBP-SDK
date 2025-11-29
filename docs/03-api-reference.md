
# 3. API Reference

This section provides a detailed reference for all available SDK methods.

---

### `sdk.wallets.getBalance(piAddress)`

Retrieves the WBP balance for a specific user wallet.

**Parameters:**

| Name        | Type     | Description                                               |
|-------------|----------|-----------------------------------------------------------|
| `piAddress` | `string` | **Required.** The user's public Pi wallet address (G...). |

**Returns:**

*   `Promise<object>` - A promise that resolves to an object containing the balance information.

**Example Success Response:**
```json
{
  "success": true,
  "asset": "WBP",
  "balance": "1234.5678000"
}
```

**Example Error Response:**
```json
{
  "success": false,
  "message": "User not found or has no WBP trustline."
}
```

**Usage:**

```javascript
try {
    const data = await sdk.wallets.getBalance('G...');
    console.log('Balance:', data.balance);
} catch (error) {
    console.error('Error:', error.message);
}
```
---
*(More API methods will be documented here as they are developed.)*

-----------------------


# 3. API 레퍼런스

이 섹션은 사용 가능한 모든 SDK 메서드에 대한 상세한 참조 정보를 제공합니다.

---

### `sdk.wallets.getBalance(piAddress)`

특정 사용자 지갑의 WBP 잔액을 조회합니다.

**매개변수 (Parameters):**

| 이름        | 타입     | 설명                                                      |
|-------------|----------|-----------------------------------------------------------|
| `piAddress` | `string` | **필수.** 조회할 사용자의 파이 공개 지갑 주소 (G...).     |

**반환값 (Returns):**

*   `Promise<object>` - 잔액 정보가 담긴 객체를 반환하는 프로미스(Promise).

**성공 응답 예시:**
```json
{
  "success": true,
  "asset": "WBP",
  "balance": "1234.5678000"
}
```

**실패 응답 예시:**
```json
{
  "success": false,
  "message": "사용자를 찾을 수 없거나 WBP 신뢰선이 설정되지 않았습니다."
}
```

**사용 예제:**

```javascript
try {
    const data = await sdk.wallets.getBalance('G...');
    console.log('잔액:', data.balance);
} catch (error) {
    console.error('오류:', error.message);
}
```
---
*(더 많은 API 메서드들이 개발됨에 따라 여기에 문서화될 예정입니다.)*