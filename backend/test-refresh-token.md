# 🧪 Test Refresh Token trong Postman

## 📌 **Các endpoint cần test:**

### 1. **POST** `/api/auth/register` - Đăng ký user
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "role": "user"
}
```

### 2. **POST** `/api/auth/login` - Đăng nhập
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
**Response sẽ có:**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

### 3. **POST** `/api/auth/refresh` - Làm mới Access Token
```json
{
  "refreshToken": "paste_refresh_token_từ_login"
}
```
**Response:**
```json
{
  "accessToken": "new_access_token"
}
```

### 4. **GET** `/api/auth/profile` - Lấy thông tin user (cần Access Token)
**Headers:**
```
Authorization: Bearer <access_token>
```

### 5. **POST** `/api/auth/logout` - Logout (xóa 1 Refresh Token)
```json
{
  "refreshToken": "paste_refresh_token"
}
```

### 6. **POST** `/api/auth/logout-all` - Logout tất cả thiết bị
**Headers:**
```
Authorization: Bearer <access_token>
```

---

## 🔥 **Flow test:**

1. **Register** → Tạo user mới
2. **Login** → Lấy `accessToken` và `refreshToken`
3. **Profile** → Test với `accessToken` (sẽ thành công)
4. Đợi 15 phút (hoặc sửa `expiresIn: "10s"` trong `utils/jwt.js`)
5. **Profile** → Test lại với `accessToken` cũ (sẽ bị lỗi 403)
6. **Refresh** → Gửi `refreshToken` → Nhận `accessToken` mới
7. **Profile** → Test với `accessToken` mới (sẽ thành công)
8. **Logout** → Xóa `refreshToken`
9. **Refresh** → Test lại → Sẽ bị lỗi "Invalid refresh token"

---

## ✅ **Expected Results:**

- **Login:** Trả về `accessToken` (15 phút) + `refreshToken` (7 ngày)
- **Profile:** Thành công khi có `accessToken` hợp lệ
- **Refresh:** Tạo `accessToken` mới khi gửi `refreshToken` hợp lệ
- **Logout:** Xóa 1 `refreshToken` khỏi DB
- **Logout All:** Xóa toàn bộ `refreshToken` của user

