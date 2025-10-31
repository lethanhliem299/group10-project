# 🧪 Test Activity Logging & Rate Limiting trong Postman

## 📌 **Tổng quan:**

### **Activity Logging:**
- Log tất cả requests (method, endpoint, status, IP, userAgent)
- TTL: Tự động xóa logs sau 30 ngày
- Admin có thể xem tất cả logs, filter, và thống kê
- User có thể xem logs của chính mình

### **Rate Limiting:**
- **Login:** Max 5 requests / 15 phút (chống brute force)
- **Register:** Max 3 requests / 1 giờ
- **Forgot Password:** Max 3 requests / 1 giờ (chống spam email)
- **Upload:** Max 10 requests / 15 phút
- **Global API:** Max 100 requests / 15 phút

---

## 🧪 **Test Activity Logging:**

### **Test 1: User xem logs của chính mình**

#### Request:
```
GET /api/logs/my-logs?page=1&limit=20
Headers:
  Authorization: Bearer <user_access_token>
```

#### Expected Response (200):
```json
{
  "total": 25,
  "page": 1,
  "totalPages": 2,
  "logs": [
    {
      "_id": "...",
      "userId": "...",
      "action": "GET /api/logs/my-logs",
      "method": "GET",
      "endpoint": "/api/logs/my-logs?page=1&limit=20",
      "statusCode": 200,
      "ip": "::1",
      "userAgent": "PostmanRuntime/7.32.3",
      "timestamp": "2025-01-15T10:30:00.000Z"
    },
    // ... more logs
  ]
}
```

---

### **Test 2: Admin xem tất cả logs**

#### Request:
```
GET /api/logs?page=1&limit=50
Headers:
  Authorization: Bearer <admin_access_token>
```

#### Query Parameters (optional):
- `page`: Số trang (default: 1)
- `limit`: Số logs mỗi trang (default: 50)
- `userId`: Filter theo user ID
- `action`: Filter theo action (regex, case-insensitive)
- `method`: Filter theo HTTP method (GET, POST, PUT, DELETE)
- `startDate`: Filter từ ngày (ISO format)
- `endDate`: Filter đến ngày (ISO format)

#### Expected Response (200):
```json
{
  "total": 1542,
  "page": 1,
  "totalPages": 31,
  "logs": [
    {
      "_id": "...",
      "userId": {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      },
      "action": "POST /auth/login",
      "method": "POST",
      "endpoint": "/auth/login",
      "statusCode": 200,
      "ip": "192.168.1.100",
      "userAgent": "PostmanRuntime/7.32.3",
      "timestamp": "2025-01-15T10:30:00.000Z"
    },
    // ... more logs
  ]
}
```

---

### **Test 3: Admin filter logs**

#### Request 1: Filter theo user
```
GET /api/logs?userId=65a1b2c3d4e5f6g7h8i9j0k1
Headers:
  Authorization: Bearer <admin_access_token>
```

#### Request 2: Filter theo action
```
GET /api/logs?action=login
Headers:
  Authorization: Bearer <admin_access_token>
```

#### Request 3: Filter theo date range
```
GET /api/logs?startDate=2025-01-01&endDate=2025-01-31
Headers:
  Authorization: Bearer <admin_access_token>
```

#### Request 4: Kết hợp nhiều filters
```
GET /api/logs?method=POST&startDate=2025-01-15&limit=100
Headers:
  Authorization: Bearer <admin_access_token>
```

---

### **Test 4: Admin xem logs của 1 user cụ thể**

#### Request:
```
GET /api/logs/user/:userId?page=1&limit=50
Headers:
  Authorization: Bearer <admin_access_token>
```

**Example:**
```
GET /api/logs/user/65a1b2c3d4e5f6g7h8i9j0k1
```

#### Expected Response (200):
```json
{
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "total": 125,
  "page": 1,
  "totalPages": 3,
  "logs": [
    // ... logs của user này
  ]
}
```

---

### **Test 5: Admin xem thống kê logs**

#### Request:
```
GET /api/logs/stats?startDate=2025-01-01&endDate=2025-01-31
Headers:
  Authorization: Bearer <admin_access_token>
```

#### Expected Response (200):
```json
{
  "totalRequests": 5432,
  "successfulRequests": 4821,
  "failedRequests": 611,
  "requestsByMethod": [
    { "_id": "GET", "count": 3210 },
    { "_id": "POST", "count": 1854 },
    { "_id": "PUT", "count": 245 },
    { "_id": "DELETE", "count": 123 }
  ],
  "topEndpoints": [
    { "_id": "/auth/login", "count": 842 },
    { "_id": "/auth/profile", "count": 654 },
    { "_id": "/users", "count": 432 },
    { "_id": "/api/logs/my-logs", "count": 321 },
    // ... top 10
  ],
  "activeUsersCount": 156
}
```

---

### **Test 6: Admin xóa logs cũ**

#### Request:
```
DELETE /api/logs/clear
Headers:
  Authorization: Bearer <admin_access_token>
Content-Type: application/json

Body:
{
  "days": 30
}
```

#### Expected Response (200):
```json
{
  "message": "Đã xóa 1234 logs cũ hơn 30 ngày",
  "deletedCount": 1234
}
```

---

## 🧪 **Test Rate Limiting:**

### **Test 7: Rate limit cho Login (5 requests / 15 phút)**

#### Flow:
1. Gửi request login với **sai password** 5 lần liên tục:

```bash
POST /auth/login
{
  "email": "test@example.com",
  "password": "wrong_password"
}
```

2. Request lần 1-5: ✅ Status 400 (Wrong password)
3. Request lần 6: ❌ Status 429 (Too Many Requests)

#### Expected Response lần thứ 6 (429):
```json
{
  "message": "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút."
}
```

#### Headers nhận được:
```
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1642320000
```

---

### **Test 8: Rate limit cho Register (3 requests / 1 giờ)**

#### Flow:
Gửi request register 4 lần liên tục:

```bash
POST /auth/register
{
  "name": "Test User",
  "email": "test1@example.com",
  "password": "123456"
}
```

- Request 1-3: ✅ Status 201 hoặc 400
- Request 4: ❌ Status 429

#### Expected Response lần thứ 4 (429):
```json
{
  "message": "Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ."
}
```

---

### **Test 9: Rate limit cho Forgot Password (3 requests / 1 giờ)**

#### Flow:
Gửi request forgot-password 4 lần liên tục:

```bash
POST /api/password/forgot-password
{
  "email": "test@example.com"
}
```

- Request 1-3: ✅ Status 200
- Request 4: ❌ Status 429

#### Expected Response lần thứ 4 (429):
```json
{
  "message": "Quá nhiều yêu cầu reset password. Vui lòng thử lại sau 1 giờ."
}
```

---

### **Test 10: Rate limit cho Upload (10 requests / 15 phút)**

#### Flow:
Upload avatar 11 lần liên tục:

```bash
POST /users/avatar
Headers: Authorization: Bearer <token>
Body: form-data
  avatar: image.jpg
```

- Request 1-10: ✅ Status 200
- Request 11: ❌ Status 429

#### Expected Response lần thứ 11 (429):
```json
{
  "message": "Quá nhiều lần upload. Vui lòng thử lại sau 15 phút."
}
```

---

### **Test 11: Global API Rate Limit (100 requests / 15 phút)**

#### Flow:
Gửi 101 requests bất kỳ trong vòng 15 phút:

```bash
GET /auth/profile
Headers: Authorization: Bearer <token>
```

- Request 1-100: ✅ Status 200
- Request 101: ❌ Status 429

#### Expected Response lần thứ 101 (429):
```json
{
  "message": "Quá nhiều requests. Vui lòng thử lại sau."
}
```

---

## 🔥 **Demo Flow đầy đủ:**

### **Scenario 1: User thường xem logs của mình**

1. **Login:**
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

2. **Xem logs của mình:**
```bash
GET /api/logs/my-logs?page=1&limit=20
Headers: Authorization: Bearer <user_token>
```

3. **Thử xem tất cả logs (bị từ chối):**
```bash
GET /api/logs
Headers: Authorization: Bearer <user_token>
```
→ Status 403: Access denied

---

### **Scenario 2: Admin quản lý logs**

1. **Login Admin:**
```bash
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

2. **Xem tất cả logs:**
```bash
GET /api/logs?page=1&limit=50
Headers: Authorization: Bearer <admin_token>
```

3. **Xem thống kê:**
```bash
GET /api/logs/stats
Headers: Authorization: Bearer <admin_token>
```

4. **Filter logs theo user:**
```bash
GET /api/logs?userId=65a1b2c3d4e5f6g7h8i9j0k1
Headers: Authorization: Bearer <admin_token>
```

5. **Xóa logs cũ:**
```bash
DELETE /api/logs/clear
Headers: Authorization: Bearer <admin_token>
Body: { "days": 30 }
```

---

### **Scenario 3: Test brute force protection**

1. **Thử login sai 5 lần:**
```bash
POST /auth/login
{
  "email": "test@example.com",
  "password": "wrong1"
}
```
(Lặp lại 5 lần với password sai)

2. **Lần thứ 6 bị block:**
→ Status 429: Rate limit exceeded

3. **Đợi 15 phút hoặc reset rate limit (restart server trong dev)**

4. **Thử lại với password đúng:**
```bash
POST /auth/login
{
  "email": "test@example.com",
  "password": "correct_password"
}
```
→ Login thành công

---

## ✅ **Kết quả mong đợi:**

### **Activity Logging:**

| Test Case | Endpoint | Expected Status | Notes |
|-----------|----------|-----------------|-------|
| User xem logs của mình | `GET /api/logs/my-logs` | 200 | Chỉ logs của user đó |
| Admin xem tất cả logs | `GET /api/logs` | 200 | Pagination + filters |
| Admin filter logs | `GET /api/logs?userId=...` | 200 | Hỗ trợ nhiều filters |
| Admin xem logs 1 user | `GET /api/logs/user/:id` | 200 | Chi tiết user + logs |
| Admin xem thống kê | `GET /api/logs/stats` | 200 | Aggregation data |
| Admin xóa logs cũ | `DELETE /api/logs/clear` | 200 | Deleted count |
| User xem tất cả logs | `GET /api/logs` | 403 | Access denied |

### **Rate Limiting:**

| Endpoint | Limit | Window | Skip Successful |
|----------|-------|--------|-----------------|
| `/auth/login` | 5 | 15 min | Yes (chỉ đếm failed) |
| `/auth/register` | 3 | 1 hour | No |
| `/api/password/forgot-password` | 3 | 1 hour | No |
| `/users/avatar` | 10 | 15 min | No |
| Global API | 100 | 15 min | No |

---

## 🎯 **Tips:**

1. **Development Mode:**
   - Restart server để reset rate limits
   - Hoặc giảm `windowMs` xuống 1 phút để test nhanh

2. **Production:**
   - Logs tự động xóa sau 30 ngày (TTL)
   - Có thể chạy cleanup manual: `DELETE /api/logs/clear`

3. **Monitoring:**
   - Xem console log để track requests real-time
   - Dùng `/api/logs/stats` để xem tổng quan

4. **Security:**
   - Login rate limit chỉ đếm **failed requests**
   - Successful login không bị count vào limit
   - Admin có thể xem tất cả logs để phát hiện suspicious activity

5. **Headers:**
   - `RateLimit-Limit`: Giới hạn tối đa
   - `RateLimit-Remaining`: Số requests còn lại
   - `RateLimit-Reset`: Timestamp khi reset

