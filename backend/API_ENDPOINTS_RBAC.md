# 🔐 API Endpoints với Phân Quyền (RBAC)

## 📋 Tóm tắt Phân Quyền

| Role | Mô tả | Quyền truy cập |
|------|-------|----------------|
| **user** | Người dùng thường | Chỉ quản lý được profile của chính mình |
| **moderator** | Kiểm duyệt viên | Xem được danh sách users (read-only) |
| **admin** | Quản trị viên | Toàn quyền CRUD users, xem logs |

---

## 🔓 Public Endpoints (Không cần đăng nhập)

### 1. Đăng ký
```
POST /auth/register
Body: { name, email, password, role }
```

### 2. Đăng nhập
```
POST /auth/login
Body: { email, password }
Response: { accessToken, refreshToken, user }
```

### 3. Refresh Token
```
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken }
```

### 4. Logout
```
POST /auth/logout
Body: { refreshToken }
```

---

## 👤 User Endpoints (Cần đăng nhập)

### 1. Xem profile của chính mình
```
GET /auth/profile
Headers: Authorization: Bearer {accessToken}
```

### 2. Cập nhật profile
```
PUT /auth/profile
Headers: Authorization: Bearer {accessToken}
Body: { name, email }
```

### 3. Logout tất cả thiết bị
```
POST /auth/logout-all
Headers: Authorization: Bearer {accessToken}
```

---

## 👥 Admin Endpoints (Chỉ Admin)

### 1. Lấy danh sách tất cả users
```
GET /admin/users
Headers: Authorization: Bearer {accessToken}
Role Required: admin
```

**Test với Postman:**
```bash
# Login với tài khoản admin
POST http://localhost:5000/auth/login
Body: { "email": "admin@test.com", "password": "123456" }

# Copy accessToken từ response

# Gọi API
GET http://localhost:5000/admin/users
Headers: Authorization: Bearer {accessToken}

# Nếu role = admin → Success ✅
# Nếu role = user → 403 Forbidden ❌
```

---

### 2. Xem thông tin user theo ID
```
GET /admin/users/:id
Headers: Authorization: Bearer {accessToken}
Role Required: admin
```

**Ví dụ:**
```
GET http://localhost:5000/admin/users/676a5eda956956e7c11d4d44
```

---

### 3. Cập nhật thông tin user
```
PUT /admin/users/:id
Headers: Authorization: Bearer {accessToken}
Role Required: admin
Body: { name, email, role }
```

**Ví dụ:**
```json
PUT http://localhost:5000/admin/users/676a5eda956956e7c11d4d44
Headers: Authorization: Bearer {accessToken}
Body:
{
  "name": "Nguyễn Văn A Updated",
  "email": "updated@test.com",
  "role": "moderator"
}
```

---

### 4. Xóa user
```
DELETE /admin/users/:id
Headers: Authorization: Bearer {accessToken}
Role Required: admin
```

**Lưu ý:** 
- Không thể xóa chính mình
- Khi xóa user, tất cả refresh tokens của user đó cũng bị xóa

---

### 5. Kích hoạt/Vô hiệu hóa user
```
PATCH /admin/users/:id/toggle-active
Headers: Authorization: Bearer {accessToken}
Role Required: admin
Body: { isActive: true/false }
```

**Ví dụ vô hiệu hóa user:**
```json
PATCH http://localhost:5000/admin/users/676a5eda956956e7c11d4d44/toggle-active
Body: { "isActive": false }
```

**Kết quả:**
- User bị vô hiệu hóa → Không thể login
- Tất cả refresh tokens bị xóa → Logout khỏi tất cả thiết bị

---

### 6. Xem tất cả sessions của user
```
GET /admin/users/:id/sessions
Headers: Authorization: Bearer {accessToken}
Role Required: admin
```

**Response:**
```json
{
  "userId": "676a5eda956956e7c11d4d44",
  "totalSessions": 3,
  "sessions": [
    {
      "token": "a1b2c3d4e5f6...",
      "deviceInfo": {
        "userAgent": "Mozilla/5.0...",
        "ip": "::1"
      },
      "createdAt": "2024-10-31T10:00:00.000Z",
      "expiresAt": "2024-11-07T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Xóa tất cả sessions của user
```
DELETE /admin/users/:id/sessions
Headers: Authorization: Bearer {accessToken}
Role Required: admin
```

**Kết quả:** User bị logout khỏi tất cả thiết bị

---

## 🛡️ Moderator Endpoints (Admin + Moderator)

### 1. Xem danh sách users (Read-only)
```
GET /moderator/users
Headers: Authorization: Bearer {accessToken}
Role Required: admin hoặc moderator
```

**Lưu ý:** Moderator chỉ **XEM** được, không thể chỉnh sửa hoặc xóa

---

### 2. Xem chi tiết user (Read-only)
```
GET /moderator/users/:id
Headers: Authorization: Bearer {accessToken}
Role Required: admin hoặc moderator
```

---

## 📊 Activity Logs (Chỉ Admin)

### 1. Xem logs với filter và pagination
```
GET /logs?userId={userId}&action={action}&page={page}&limit={limit}
Headers: Authorization: Bearer {accessToken}
Role Required: admin
```

**Ví dụ:**
```
GET http://localhost:5000/logs?userId=676a5eda956956e7c11d4d44&action=login&page=1&limit=20
```

**Response:**
```json
{
  "logs": [
    {
      "_id": "1",
      "userId": "676a5eda956956e7c11d4d44",
      "action": "login",
      "ip": "::1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2024-10-31T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

---

### 2. Xóa logs cũ
```
DELETE /logs
Headers: Authorization: Bearer {accessToken}
Role Required: admin
Body: { olderThan: 30 }
```

---

## 🧪 Test Phân Quyền với Postman

### Bước 1: Tạo 3 tài khoản

**1. User thường:**
```json
POST http://localhost:5000/auth/register
Body:
{
  "name": "User Test",
  "email": "user@test.com",
  "password": "123456",
  "role": "user"
}
```

**2. Moderator:**
```json
POST http://localhost:5000/auth/register
Body:
{
  "name": "Moderator Test",
  "email": "moderator@test.com",
  "password": "123456",
  "role": "moderator"
}
```

**3. Admin:**
```json
POST http://localhost:5000/auth/register
Body:
{
  "name": "Admin Test",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

---

### Bước 2: Test phân quyền

#### Test 1: User thường gọi /admin/users
```
Login với user@test.com
→ Lấy accessToken
→ Gọi GET /admin/users
→ Kết quả: 403 Forbidden ❌
```

#### Test 2: Moderator gọi /moderator/users
```
Login với moderator@test.com
→ Lấy accessToken
→ Gọi GET /moderator/users
→ Kết quả: 200 OK ✅ (Chỉ xem được)
```

#### Test 3: Moderator gọi /admin/users
```
Login với moderator@test.com
→ Lấy accessToken
→ Gọi GET /admin/users
→ Kết quả: 403 Forbidden ❌
```

#### Test 4: Admin gọi /admin/users
```
Login với admin@test.com
→ Lấy accessToken
→ Gọi GET /admin/users
→ Kết quả: 200 OK ✅
```

#### Test 5: Admin xóa user
```
Login với admin@test.com
→ Lấy accessToken
→ Gọi DELETE /admin/users/{userId}
→ Kết quả: 200 OK ✅
```

---

## 🔒 Cách Middleware Kiểm Tra Quyền Hoạt Động

### 1. verifyToken (Kiểm tra đăng nhập)
```javascript
// Kiểm tra xem có accessToken hợp lệ không
Authorization: Bearer {accessToken}
→ Decode token
→ Lấy được: { id, role }
→ Gán vào: req.user = { id, role }
```

### 2. checkAdmin (Kiểm tra role admin)
```javascript
if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
}
```

### 3. checkAdminOrModerator (Kiểm tra role admin hoặc moderator)
```javascript
if (req.user.role !== "admin" && req.user.role !== "moderator") {
  return res.status(403).json({ message: "Chỉ admin và moderator mới có quyền truy cập" });
}
```

---

## 📝 Tóm Tắt HTTP Status Codes

| Code | Meaning | Khi nào xảy ra |
|------|---------|----------------|
| **200** | OK | Request thành công |
| **201** | Created | Tạo mới thành công (register) |
| **400** | Bad Request | Dữ liệu không hợp lệ |
| **401** | Unauthorized | Không có token hoặc token hết hạn |
| **403** | Forbidden | Token hợp lệ nhưng không có quyền (role không đủ) |
| **404** | Not Found | Không tìm thấy resource |
| **500** | Internal Server Error | Lỗi server |

---

## 🎯 Kết Luận

### Các endpoint kiểm tra quyền:

✅ **Admin Only:**
- `GET /admin/users` - Lấy tất cả users
- `PUT /admin/users/:id` - Cập nhật user
- `DELETE /admin/users/:id` - Xóa user
- `PATCH /admin/users/:id/toggle-active` - Kích hoạt/vô hiệu hóa user
- `GET /admin/users/:id/sessions` - Xem sessions
- `DELETE /admin/users/:id/sessions` - Xóa sessions
- `GET /logs` - Xem activity logs

✅ **Admin + Moderator:**
- `GET /moderator/users` - Xem users (read-only)
- `GET /moderator/users/:id` - Xem chi tiết user (read-only)

✅ **All Authenticated Users:**
- `GET /auth/profile` - Xem profile
- `PUT /auth/profile` - Cập nhật profile
- `POST /auth/logout-all` - Logout tất cả thiết bị

---

Made with ❤️ by Group 10

