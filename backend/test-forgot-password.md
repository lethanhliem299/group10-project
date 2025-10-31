# 🧪 Test Forgot Password & Reset Password trong Postman

## 📌 **Setup Gmail SMTP:**

### 1. Tạo App Password cho Gmail
Google không cho phép sử dụng mật khẩu thông thường cho ứng dụng bên ngoài. Bạn cần tạo **App Password**:

#### Bước 1: Bật 2-Step Verification
1. Truy cập: https://myaccount.google.com/security
2. Tìm **2-Step Verification** → Bật nó lên

#### Bước 2: Tạo App Password
1. Sau khi bật 2-Step, vào: https://myaccount.google.com/apppasswords
2. Chọn **App**: Mail
3. Chọn **Device**: Other (Custom name) → Nhập "Node.js Backend"
4. Click **Generate**
5. Copy **16-ký tự App Password** (ví dụ: `abcd efgh ijkl mnop`)

### 2. Cập nhật file `backend/pro.env`
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=User Management System
FRONTEND_URL=http://localhost:3000
```

**⚠️ Lưu ý:** 
- `EMAIL_PASSWORD` phải là **App Password** (16 ký tự, không có dấu cách)
- KHÔNG dùng mật khẩu Gmail thông thường

### 3. Cài đặt dependencies
```bash
cd backend
npm install
```

---

## 🧪 **Test Cases:**

### **Test 1: Forgot Password - Gửi email**

#### Request:
```
POST /api/password/forgot-password
Content-Type: application/json

Body:
{
  "email": "test@example.com"
}
```

#### Expected Response (200):
```json
{
  "message": "Email reset password đã được gửi. Vui lòng kiểm tra hộp thư của bạn."
}
```

#### Kiểm tra:
1. ✅ Email được gửi đến `test@example.com`
2. ✅ Email chứa link reset password: `http://localhost:3000/reset-password/<token>`
3. ✅ Token lưu vào DB (đã hash)
4. ✅ `resetPasswordExpires` = 1 giờ sau

---

### **Test 2: Verify Reset Token**

#### Request:
```
GET /api/password/verify-token/:token
```

**Ví dụ:**
```
GET /api/password/verify-token/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

#### Expected Response (200):
```json
{
  "message": "Token hợp lệ",
  "email": "test@example.com"
}
```

#### Expected Response (400) - Token hết hạn:
```json
{
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

---

### **Test 3: Reset Password**

#### Request:
```
POST /api/password/reset-password/:token
Content-Type: application/json

Body:
{
  "password": "newpassword123"
}
```

**Ví dụ:**
```
POST /api/password/reset-password/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

Body:
{
  "password": "newpassword123"
}
```

#### Expected Response (200):
```json
{
  "message": "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới."
}
```

#### Kiểm tra:
1. ✅ Password được hash và lưu vào DB
2. ✅ `resetPasswordToken` và `resetPasswordExpires` bị xóa (undefined)
3. ✅ User có thể đăng nhập với password mới

---

### **Test 4: Change Password (khi đã đăng nhập)**

#### Request:
```
POST /api/password/change-password
Headers:
  Authorization: Bearer <your_access_token>
Content-Type: application/json

Body:
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

#### Expected Response (200):
```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

#### Expected Response (400) - Sai mật khẩu hiện tại:
```json
{
  "message": "Mật khẩu hiện tại không đúng"
}
```

---

### **Test 5: Forgot Password - Email không tồn tại (Error case)**

#### Request:
```json
POST /api/password/forgot-password

Body:
{
  "email": "notexist@example.com"
}
```

#### Expected Response (404):
```json
{
  "message": "Email không tồn tại trong hệ thống"
}
```

---

### **Test 6: Reset Password - Token hết hạn (Error case)**

#### Request:
```
POST /api/password/reset-password/expired_token_here

Body:
{
  "password": "newpassword123"
}
```

#### Expected Response (400):
```json
{
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

---

### **Test 7: Reset Password - Mật khẩu quá ngắn (Error case)**

#### Request:
```json
POST /api/password/reset-password/:token

Body:
{
  "password": "123"
}
```

#### Expected Response (400):
```json
{
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

---

### **Test 8: Change Password - Không có token (Error case)**

#### Request:
```
POST /api/password/change-password

Body:
{
  "currentPassword": "old",
  "newPassword": "new"
}
```
(Không có Authorization header)

#### Expected Response (401):
```json
{
  "message": "Access token is required"
}
```

---

## 🔥 **Flow Test đầy đủ:**

### **Scenario 1: User quên mật khẩu**

1. **Forgot Password:**
```bash
POST /api/password/forgot-password
{
  "email": "test@example.com"
}
```
→ Nhận email với link reset

2. **Mở email** → Click link hoặc copy token từ URL

3. **Verify Token:**
```bash
GET /api/password/verify-token/<token>
```
→ Kiểm tra token hợp lệ

4. **Reset Password:**
```bash
POST /api/password/reset-password/<token>
{
  "password": "newpassword123"
}
```
→ Đổi password thành công

5. **Login:**
```bash
POST /auth/login
{
  "email": "test@example.com",
  "password": "newpassword123"
}
```
→ Đăng nhập thành công với password mới

---

### **Scenario 2: User đã đăng nhập muốn đổi mật khẩu**

1. **Login:**
```bash
POST /auth/login
{
  "email": "test@example.com",
  "password": "currentpassword"
}
```
→ Lấy `accessToken`

2. **Change Password:**
```bash
POST /api/password/change-password
Headers: Authorization: Bearer <accessToken>
{
  "currentPassword": "currentpassword",
  "newPassword": "newpassword456"
}
```
→ Đổi password thành công

3. **Login lại:**
```bash
POST /auth/login
{
  "email": "test@example.com",
  "password": "newpassword456"
}
```
→ Đăng nhập thành công với password mới

---

## 📧 **Mẫu Email nhận được:**

### Subject: 🔐 Reset Password Request

```html
Reset Your Password

Hello,

You requested to reset your password. Click the button below to reset it:

[Reset Password] (Button)

Or copy and paste this link into your browser:
http://localhost:3000/reset-password/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

⚠️ This link will expire in 1 hour.
If you didn't request this, please ignore this email.

---
User Management System Team
© 2025 All rights reserved.
```

---

## ✅ **Kết quả mong đợi:**

| Test Case | Method | Endpoint | Expected Status |
|-----------|--------|----------|-----------------|
| Forgot Password | POST | `/api/password/forgot-password` | 200 |
| Verify Token | GET | `/api/password/verify-token/:token` | 200 |
| Reset Password | POST | `/api/password/reset-password/:token` | 200 |
| Change Password | POST | `/api/password/change-password` | 200 |
| Email không tồn tại | POST | `/api/password/forgot-password` | 404 |
| Token hết hạn | POST | `/api/password/reset-password/:token` | 400 |
| Mật khẩu quá ngắn | POST | `/api/password/reset-password/:token` | 400 |
| Không có token | POST | `/api/password/change-password` | 401 |

---

## 🎯 **Tips:**

1. **Test Email trong Development:**
   - Dùng Gmail cá nhân
   - Hoặc dùng dịch vụ test: https://mailtrap.io (không cần Gmail thật)

2. **Token Expiration:**
   - Token hết hạn sau **1 giờ**
   - Sau 1 giờ, user phải request lại forgot-password

3. **Security:**
   - Token được hash (SHA-256) trước khi lưu DB
   - Token gốc chỉ gửi qua email, không lưu DB
   - Mỗi lần reset password, token cũ tự động bị xóa

4. **Frontend Integration:**
   - Frontend nhận token từ URL: `/reset-password/:token`
   - Gọi API verify token trước để kiểm tra
   - Nếu hợp lệ, hiển thị form nhập password mới

