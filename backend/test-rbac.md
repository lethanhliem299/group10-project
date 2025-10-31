# 🧪 Test RBAC (Role-Based Access Control) trong Postman

## 📌 **Các Role trong hệ thống:**

- **user**: Người dùng thông thường (xem/sửa profile của mình)
- **moderator**: Người kiểm duyệt (xem danh sách users, xem chi tiết user)
- **admin**: Quản trị viên (full quyền: CRUD users, thay đổi role, kích hoạt/vô hiệu hóa user)

---

## 🔧 **Setup Test:**

### 1. Tạo Admin user (dùng MongoDB Compass hoặc tạo qua code)
```javascript
// Trong MongoDB hoặc seed script:
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "$2a$10$...", // hash của "admin123"
  "role": "admin",
  "isActive": true
}
```

### 2. Tạo Moderator user
```javascript
{
  "name": "Moderator User",
  "email": "mod@test.com",
  "password": "$2a$10$...", // hash của "mod123"
  "role": "moderator",
  "isActive": true
}
```

### 3. Tạo Normal user (qua API register)
```json
POST /auth/register
{
  "name": "Normal User",
  "email": "user@test.com",
  "password": "user123"
}
```

---

## 🧪 **Test Cases:**

### **Test 1: Login với các role khác nhau**

#### A. Login Admin
```json
POST /auth/login
{
  "email": "admin@test.com",
  "password": "admin123"
}
```
**Expected:** Trả về `accessToken`, `refreshToken`, `user.role = "admin"`

#### B. Login Moderator
```json
POST /auth/login
{
  "email": "mod@test.com",
  "password": "mod123"
}
```
**Expected:** Trả về `accessToken`, `refreshToken`, `user.role = "moderator"`

#### C. Login User
```json
POST /auth/login
{
  "email": "user@test.com",
  "password": "user123"
}
```
**Expected:** Trả về `accessToken`, `refreshToken`, `user.role = "user"`

---

### **Test 2: Admin - Quản lý Users (Full CRUD)**

**Headers:** `Authorization: Bearer <admin_access_token>`

#### 2.1. Lấy tất cả users
```
GET /api/admin/users
```
**Expected:** Status 200, danh sách tất cả users

#### 2.2. Lấy user theo ID
```
GET /api/admin/users/:id
```
**Expected:** Status 200, thông tin user

#### 2.3. Tạo user mới
```json
POST /api/admin/users
{
  "name": "New User",
  "email": "newuser@test.com",
  "password": "password123",
  "role": "moderator"
}
```
**Expected:** Status 201, user mới được tạo

#### 2.4. Cập nhật user
```json
PUT /api/admin/users/:id
{
  "name": "Updated Name",
  "role": "moderator",
  "isActive": true
}
```
**Expected:** Status 200, user được update

#### 2.5. Thay đổi role user
```json
PATCH /api/admin/users/:id/role
{
  "role": "admin"
}
```
**Expected:** Status 200, role được thay đổi

#### 2.6. Kích hoạt/vô hiệu hóa user
```
PATCH /api/admin/users/:id/toggle-status
```
**Expected:** Status 200, `isActive` toggle, nếu `isActive = false` thì tất cả token bị revoke

#### 2.7. Xóa user
```
DELETE /api/admin/users/:id
```
**Expected:** Status 200, user bị xóa, tất cả token bị revoke

---

### **Test 3: Moderator - Chỉ đọc Users**

**Headers:** `Authorization: Bearer <moderator_access_token>`

#### 3.1. Lấy tất cả users
```
GET /api/moderator/users
```
**Expected:** ✅ Status 200, danh sách users

#### 3.2. Lấy user theo ID
```
GET /api/moderator/users/:id
```
**Expected:** ✅ Status 200, thông tin user

#### 3.3. Thử tạo user (không có quyền)
```json
POST /api/admin/users
{
  "name": "Hacker",
  "email": "hacker@test.com",
  "password": "123"
}
```
**Expected:** ❌ Status 403, "Access denied"

#### 3.4. Thử xóa user (không có quyền)
```
DELETE /api/admin/users/:id
```
**Expected:** ❌ Status 403, "Access denied"

---

### **Test 4: Normal User - Bị chặn hoàn toàn**

**Headers:** `Authorization: Bearer <user_access_token>`

#### 4.1. Thử lấy danh sách users
```
GET /api/admin/users
```
**Expected:** ❌ Status 403, "Access denied. Required roles: admin"

#### 4.2. Thử lấy danh sách users (moderator route)
```
GET /api/moderator/users
```
**Expected:** ❌ Status 403, "Access denied. Required roles: admin, moderator"

---

### **Test 5: Truy cập không có token**

#### 5.1. Không gửi Authorization header
```
GET /api/admin/users
```
**Expected:** ❌ Status 401, "Access token is required"

#### 5.2. Gửi token không hợp lệ
```
Headers: Authorization: Bearer invalid_token_here
GET /api/admin/users
```
**Expected:** ❌ Status 403, "Invalid or expired access token"

---

## ✅ **Kết quả mong đợi:**

| Role | GET users | CREATE user | UPDATE user | DELETE user |
|------|-----------|-------------|-------------|-------------|
| **admin** | ✅ | ✅ | ✅ | ✅ |
| **moderator** | ✅ | ❌ | ❌ | ❌ |
| **user** | ❌ | ❌ | ❌ | ❌ |
| **No token** | ❌ | ❌ | ❌ | ❌ |

---

## 🔥 **Tip: Tạo seed data nhanh**

Tạo file `backend/seeds/users.js`:
```javascript
import User from "../models/User.js";
import mongoose from "mongoose";

const seedUsers = async () => {
  await mongoose.connect("mongodb://localhost:27017/group10");

  await User.create([
    { name: "Admin", email: "admin@test.com", password: "admin123", role: "admin" },
    { name: "Moderator", email: "mod@test.com", password: "mod123", role: "moderator" },
    { name: "User", email: "user@test.com", password: "user123", role: "user" },
  ]);

  console.log("✅ Seed completed!");
  process.exit();
};

seedUsers();
```

Chạy: `node backend/seeds/users.js`

