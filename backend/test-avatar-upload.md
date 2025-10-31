# 🧪 Test Avatar Upload trong Postman

## 📌 **Setup Cloudinary:**

### 1. Đăng ký tài khoản miễn phí
- Truy cập: https://cloudinary.com
- Sign up (miễn phí, không cần credit card)
- Vào Dashboard → lấy thông tin:
  - **Cloud Name**
  - **API Key**
  - **API Secret**

### 2. Cập nhật file `backend/pro.env`
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=1234567890123456
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 3. Cài đặt dependencies
```bash
cd backend
npm install
```

---

## 🧪 **Test Cases:**

### **Test 1: Upload Avatar**

#### Request:
```
POST /users/avatar
Headers:
  Authorization: Bearer <your_access_token>
Body: form-data
  avatar: [chọn file ảnh từ máy]
```

#### Expected Response (200):
```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/avatars/avatar_user_id_timestamp.png"
}
```

#### Chi tiết trong Postman:
1. Method: **POST**
2. URL: `http://localhost:5000/users/avatar`
3. Headers:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Body:
   - Chọn **form-data**
   - Key: `avatar` (chọn type là **File**)
   - Value: Click **Select Files** → chọn ảnh từ máy (jpeg, jpg, png, gif, webp)
5. Click **Send**

---

### **Test 2: Xem avatar sau khi upload**

#### Request:
```
GET /auth/profile
Headers:
  Authorization: Bearer <your_access_token>
```

#### Expected Response (200):
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "avatar": "https://res.cloudinary.com/.../avatar_xxx.png",
  "avatarPublicId": "avatars/avatar_xxx",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### **Test 3: Upload avatar mới (replace avatar cũ)**

#### Request:
```
POST /users/avatar
Headers:
  Authorization: Bearer <your_access_token>
Body: form-data
  avatar: [chọn ảnh mới]
```

#### Expected:
- ✅ Ảnh cũ trên Cloudinary bị xóa tự động
- ✅ Ảnh mới được upload
- ✅ URL mới được trả về

---

### **Test 4: Delete avatar**

#### Request:
```
DELETE /users/avatar
Headers:
  Authorization: Bearer <your_access_token>
```

#### Expected Response (200):
```json
{
  "message": "Xóa avatar thành công"
}
```

#### Kiểm tra:
- ✅ Ảnh trên Cloudinary bị xóa
- ✅ Field `avatar` và `avatarPublicId` trong DB = ""

---

### **Test 5: Upload file không phải ảnh (Error case)**

#### Request:
```
POST /users/avatar
Body: form-data
  avatar: document.pdf
```

#### Expected Response (400):
```json
{
  "message": "Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)"
}
```

---

### **Test 6: Upload ảnh quá lớn (Error case)**

#### Request:
```
POST /users/avatar
Body: form-data
  avatar: very_large_image.jpg (> 5MB)
```

#### Expected Response (400):
```json
{
  "message": "File too large"
}
```

---

### **Test 7: Upload không có token (Error case)**

#### Request:
```
POST /users/avatar
Body: form-data
  avatar: image.jpg
```
(Không có Authorization header)

#### Expected Response (401):
```json
{
  "message": "Access token is required"
}
```

---

### **Test 8: Delete avatar khi chưa có avatar (Error case)**

#### Request:
```
DELETE /users/avatar
Headers:
  Authorization: Bearer <your_access_token>
```

#### Expected Response (400):
```json
{
  "message": "User chưa có avatar"
}
```

---

## 🔥 **Tính năng đặc biệt:**

### ✅ **1. Tự động resize ảnh**
- Ảnh upload sẽ tự động resize về **500x500px**
- Format: **PNG** (chất lượng 90%)
- Giúp tiết kiệm băng thông và tăng tốc độ load

### ✅ **2. Tự động xóa ảnh cũ**
- Khi upload ảnh mới, ảnh cũ trên Cloudinary tự động bị xóa
- Tránh rác trên Cloudinary

### ✅ **3. Bảo mật**
- Chỉ user đã đăng nhập mới upload được
- Mỗi user chỉ upload avatar cho chính mình

### ✅ **4. Giới hạn file**
- Chỉ chấp nhận: jpeg, jpg, png, gif, webp
- Max size: **5MB**

---

## 📸 **Kiểm tra trên Cloudinary Dashboard:**

1. Login vào https://cloudinary.com
2. Vào **Media Library**
3. Vào folder **avatars/**
4. Bạn sẽ thấy các ảnh đã upload:
   - `avatar_<user_id>_<timestamp>.png`

---

## ✅ **Kết quả mong đợi:**

| Test Case | Method | Endpoint | Expected Status |
|-----------|--------|----------|-----------------|
| Upload avatar | POST | `/users/avatar` | 200 |
| View profile with avatar | GET | `/auth/profile` | 200 |
| Replace avatar | POST | `/users/avatar` | 200 |
| Delete avatar | DELETE | `/users/avatar` | 200 |
| Upload non-image | POST | `/users/avatar` | 400 |
| Upload too large | POST | `/users/avatar` | 400 |
| Upload no token | POST | `/users/avatar` | 401 |
| Delete no avatar | DELETE | `/users/avatar` | 400 |

---

## 🎯 **Demo Flow:**

1. **Register** → Tạo user mới
2. **Login** → Lấy `accessToken`
3. **Upload Avatar** → Upload ảnh đầu tiên
4. **Get Profile** → Xem avatar URL
5. Copy avatar URL → mở trên browser → Xem ảnh
6. **Upload Avatar** lần 2 → Upload ảnh khác
7. Kiểm tra Cloudinary → ảnh cũ đã bị xóa
8. **Delete Avatar** → Xóa ảnh
9. **Get Profile** → `avatar: ""`

