# 🎯 User Management System - Advanced Features

## 📌 **Tổng quan dự án**

Hệ thống quản lý user với các tính năng bảo mật nâng cao, phân quyền chi tiết, và frontend hiện đại.

### **Công nghệ sử dụng:**

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (Access Token + Refresh Token)
- Cloudinary (Avatar Upload)
- Nodemailer (Email Service)
- Express-Rate-Limit
- Multer + Sharp (Image Processing)

**Frontend:**
- React 18
- Redux Toolkit
- React Router v6
- Axios

---

## 🚀 **Tính năng chính**

### ✅ **1. Authentication & Authorization**
- [x] JWT Access Token (15 phút)
- [x] Refresh Token (7 ngày, lưu DB)
- [x] Session Management
- [x] Logout / Logout All Devices
- [x] Auto Refresh Token (Frontend interceptor)

### ✅ **2. Role-Based Access Control (RBAC)**
- [x] 3 Roles: **User**, **Admin**, **Moderator**
- [x] Middleware `checkRole()`
- [x] Admin: Full CRUD users
- [x] Moderator: Read-only access
- [x] User: Xem/sửa profile của mình

### ✅ **3. Avatar Upload**
- [x] Upload lên Cloudinary
- [x] Auto resize 500x500px
- [x] Convert to PNG
- [x] Auto delete old avatar
- [x] Max size: 5MB
- [x] Validation: jpeg, jpg, png, gif, webp

### ✅ **4. Password Management**
- [x] Forgot Password
- [x] Reset Password via Email
- [x] Change Password (khi đã login)
- [x] Email HTML template
- [x] Token expires 1 hour
- [x] Token hashed (SHA-256)

### ✅ **5. Activity Logging**
- [x] Log tất cả requests
- [x] TTL: Auto delete sau 30 ngày
- [x] Admin xem tất cả logs
- [x] User xem logs của mình
- [x] Pagination & Filters
- [x] Statistics (aggregation)

### ✅ **6. Rate Limiting (Brute Force Protection)**
- [x] Login: 5 requests / 15 phút
- [x] Register: 3 requests / 1 giờ
- [x] Forgot Password: 3 requests / 1 giờ
- [x] Upload: 10 requests / 15 phút
- [x] Global API: 100 requests / 15 phút

### ✅ **7. Frontend với Redux Toolkit**
- [x] Redux store + auth slice
- [x] Protected Routes
- [x] Auto Refresh Token interceptor
- [x] Role-based UI
- [x] Pages: Login, Register, Dashboard, Profile, AdminPanel

---

## 📦 **Cài đặt và chạy dự án**

### **1. Clone Repository**
```bash
git clone https://github.com/lethanhliem299/group10-project.git
cd group10-project
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

**Cấu hình file `backend/pro.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/mydatabase
PORT=5000
JWT_SECRET=your_jwt_secret_key_12345
REFRESH_TOKEN_SECRET=your_refresh_token_secret_67890

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=User Management System

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Chạy Backend:**
```bash
npm start
```
→ Backend chạy tại `http://localhost:5000`

### **3. Frontend Setup**
```bash
cd frontend
npm install
```

**Cấu hình file `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
```

**Chạy Frontend:**
```bash
npm start
```
→ Frontend chạy tại `http://localhost:3000`

### **4. MongoDB Setup**
```bash
# Cài đặt MongoDB (nếu chưa có)
# https://www.mongodb.com/try/download/community

# Chạy MongoDB
mongod
```

---

## 🗂️ **Cấu trúc Project**

```
group10-project/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── avatarController.js
│   │   ├── passwordController.js
│   │   └── activityLogController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── checkRole.js
│   │   ├── verifyToken.js
│   │   ├── uploadAvatar.js
│   │   ├── logActivity.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── RefreshToken.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── moderatorRoutes.js
│   │   ├── passwordRoutes.js
│   │   ├── logRoutes.js
│   │   └── user.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── emailService.js
│   ├── server.js
│   ├── package.json
│   └── pro.env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── features/
│   │   │   └── auth/
│   │   │       └── authSlice.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── User-Management-API.postman_collection.json
├── FRONTEND_GUIDE_SV2.md
├── GIT_COMMANDS_SV1.sh
├── GIT_COMMANDS_SV2.sh
├── GIT_COMMANDS_SV3.sh
└── README_FINAL.md
```

---

## 📝 **API Endpoints**

### **Authentication**
```
POST   /auth/register              # Đăng ký
POST   /auth/login                 # Đăng nhập
POST   /auth/refresh               # Refresh access token
POST   /auth/logout                # Logout (1 device)
POST   /auth/logout-all            # Logout (all devices)
GET    /auth/profile               # Get profile
PUT    /auth/profile               # Update profile
```

### **Password Management**
```
POST   /api/password/forgot-password       # Gửi email reset
GET    /api/password/verify-token/:token   # Verify token
POST   /api/password/reset-password/:token # Reset password
POST   /api/password/change-password       # Change password (protected)
```

### **Admin - User Management**
```
GET    /api/admin/users            # Lấy tất cả users
GET    /api/admin/users/:id        # Lấy user theo ID
POST   /api/admin/users            # Tạo user mới
PUT    /api/admin/users/:id        # Update user
DELETE /api/admin/users/:id        # Xóa user
PATCH  /api/admin/users/:id/role   # Thay đổi role
PATCH  /api/admin/users/:id/toggle-status  # Toggle active status
```

### **Moderator - Read Only**
```
GET    /api/moderator/users        # Xem tất cả users
GET    /api/moderator/users/:id    # Xem user theo ID
```

### **Avatar Upload**
```
POST   /users/avatar               # Upload avatar
DELETE /users/avatar               # Delete avatar
```

### **Activity Logs**
```
GET    /api/logs/my-logs           # User xem logs của mình
GET    /api/logs                   # Admin xem tất cả logs
GET    /api/logs/user/:userId      # Admin xem logs của 1 user
GET    /api/logs/stats             # Admin xem thống kê
DELETE /api/logs/clear             # Admin xóa logs cũ
```

---

## 🧪 **Testing với Postman**

### **1. Import Collection**
1. Mở Postman
2. Click **Import**
3. Chọn file `User-Management-API.postman_collection.json`

### **2. Set Variables**
- `baseUrl`: `http://localhost:5000`
- `accessToken`: (auto set sau login)
- `refreshToken`: (auto set sau login)

### **3. Test Flow**
1. **Register** → Tạo user mới
2. **Login** → Lưu tokens tự động
3. **Get Profile** → Test authentication
4. **Upload Avatar** → Test file upload
5. **Admin endpoints** → Test RBAC
6. **Forgot Password** → Test email service
7. **Get Logs** → Test activity logging

---

## 📊 **Phân công nhiệm vụ nhóm**

### **SV1 - Backend Advanced**
✅ Activity 1: Refresh Token & Session Management  
✅ Activity 2: Advanced RBAC  
✅ Activity 3: Avatar Upload with Cloudinary  

### **SV3 - Database & Integration**
✅ Activity 4: Forgot Password & Reset Password  
✅ Activity 5: Activity Logging & Rate Limiting  

### **SV2 - Frontend Advanced**
✅ Activity 6: Redux Toolkit & Protected Routes  

---

## 🎯 **Git Workflow**

### **Branching Strategy**
```
main (production)
├── feature/refresh-token (SV1)
├── feature/rbac (SV1)
├── feature/avatar-upload (SV1)
├── feature/forgot-password (SV3)
├── feature/log-rate-limit (SV3)
└── feature/redux-protected (SV2)
```

### **Merge to Main**
```bash
# Merge từng branch vào main
git checkout main
git merge feature/refresh-token
git merge feature/rbac
git merge feature/avatar-upload
git merge feature/forgot-password
git merge feature/log-rate-limit
git merge feature/redux-protected

# Push to GitHub
git push origin main
```

---

## 🔐 **Security Features**

1. **JWT Token Security**
   - Access Token ngắn hạn (15 phút)
   - Refresh Token dài hạn (7 ngày)
   - Token stored in DB (có thể revoke)

2. **Password Security**
   - Bcrypt hashing
   - Reset token hashed (SHA-256)
   - Token expires 1 hour

3. **Rate Limiting**
   - Chống brute force login
   - Chống spam registration
   - Chống spam email

4. **Input Validation**
   - Email format
   - Password length (min 6 chars)
   - File type & size validation

5. **RBAC**
   - Role-based middleware
   - Protected routes
   - Least privilege principle

---

## 📚 **Tài liệu tham khảo**

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Cloudinary](https://cloudinary.com/documentation)
- [Nodemailer](https://nodemailer.com/)

---

## 👥 **Team Members**

- **SV1**: Backend Advanced Developer
- **SV2**: Frontend Advanced Developer
- **SV3**: Database & Integration Specialist

---

## 📄 **License**

MIT License - Group 10 Project © 2025

---

## 🎉 **Hoàn thành!**

✅ Backend API: 6/6 Activities  
✅ Frontend Guide: Complete  
✅ Postman Collection: 35+ endpoints  
✅ Documentation: Comprehensive  
✅ Git Workflow: Organized  

🚀 **Ready for Production!**

