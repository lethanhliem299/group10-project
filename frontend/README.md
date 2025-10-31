# 🎉 User Management System - Frontend

Hệ thống quản lý người dùng hoàn chỉnh với React, Redux, Protected Routes và Refresh Token.

## 📋 Tính năng

### 🔐 Authentication
- ✅ Đăng ký (Register)
- ✅ Đăng nhập (Login)
- ✅ Tự động refresh token khi hết hạn
- ✅ Logout (thu hồi refresh token)

### 👤 Profile Management
- ✅ Xem profile
- ✅ Chỉnh sửa thông tin (tên, email)
- ✅ Upload/Delete avatar
- ✅ Đổi mật khẩu

### 👥 User Management (Admin Only)
- ✅ Xem danh sách tất cả users
- ✅ Chỉnh sửa thông tin user
- ✅ Kích hoạt/Vô hiệu hóa user
- ✅ Xóa user

### 📊 Activity Logs (Admin Only)
- ✅ Xem lịch sử hoạt động của users
- ✅ Lọc theo User ID, Action
- ✅ Phân trang

## 🚀 Cách chạy

### 1. Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Chạy frontend
\`\`\`bash
npm start
\`\`\`

Frontend sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc thư mục

\`\`\`
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation bar
│   │   ├── Navbar.css
│   │   ├── ProtectedRoute.js  # Protected route component
│   │   ├── Auth.js            # Auth component (legacy)
│   │   └── Auth.css
│   ├── pages/
│   │   ├── Login.js           # Trang đăng nhập
│   │   ├── Register.js        # Trang đăng ký
│   │   ├── Dashboard.js       # Trang dashboard
│   │   ├── Profile.js         # Trang profile
│   │   ├── UserManagement.js  # Trang quản lý users (Admin)
│   │   ├── ActivityLogs.js    # Trang xem logs (Admin)
│   │   └── *.css              # CSS files
│   ├── utils/
│   │   └── axiosConfig.js     # Axios interceptor (auto refresh token)
│   ├── App.js                 # Main app với routing
│   ├── App.css
│   └── index.js
└── package.json
\`\`\`

## 🔑 Phân quyền

### User (user)
- ✅ Xem dashboard
- ✅ Quản lý profile cá nhân
- ❌ Không truy cập được User Management
- ❌ Không truy cập được Activity Logs

### Admin (admin)
- ✅ Tất cả quyền của User
- ✅ Quản lý tất cả users
- ✅ Xem activity logs
- ✅ Kích hoạt/vô hiệu hóa users

### Moderator (moderator)
- ✅ Xem dashboard
- ✅ Quản lý profile cá nhân
- ✅ Xem danh sách users (read-only)

## 🎨 Giao diện

Giao diện được thiết kế theo phong cách **Mangools**:
- Màu be/cream (#fffbf0) cho background
- Màu xanh lá (#48bb78) cho buttons chính
- Card trắng với shadow mềm mại
- Typography rõ ràng, dễ đọc

## 🔄 Auto Refresh Token

Hệ thống tự động refresh token khi:
1. Access token hết hạn (15 phút)
2. API trả về lỗi 401 Unauthorized
3. Axios interceptor tự động gọi `/auth/refresh`
4. Lưu access token mới vào localStorage
5. Retry request ban đầu với token mới

Nếu refresh token cũng hết hạn → Logout tự động

## 📝 API Endpoints được sử dụng

### Auth
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Đăng xuất
- `GET /auth/profile` - Lấy profile
- `PUT /auth/profile` - Cập nhật profile

### Password
- `POST /password/change-password` - Đổi mật khẩu

### Avatar
- `POST /users/avatar` - Upload avatar
- `DELETE /users/avatar` - Xóa avatar

### Admin
- `GET /admin/users` - Lấy danh sách users
- `PUT /admin/users/:id` - Cập nhật user
- `DELETE /admin/users/:id` - Xóa user
- `PATCH /admin/users/:id/toggle-active` - Kích hoạt/vô hiệu hóa user

### Logs
- `GET /logs` - Lấy activity logs (có phân trang)

## 🧪 Test hệ thống

### 1. Test đăng nhập/đăng ký
1. Truy cập `http://localhost:3000`
2. Nhấn "Sign up" để đăng ký tài khoản mới
3. Đăng nhập với tài khoản vừa tạo

### 2. Test refresh token
1. Đăng nhập thành công
2. Mở DevTools (F12) → Console
3. Nhấn "🔄 Reload Profile"
4. Đợi 15 phút (hoặc giảm thời gian expire trong backend)
5. Nhấn lại "🔄 Reload Profile"
6. Console sẽ hiện: "🔄 Access token hết hạn, đang refresh..."
7. Token mới được lưu tự động

### 3. Test phân quyền
1. Đăng nhập với tài khoản **user** → Không thấy menu "Users" và "Logs"
2. Đăng nhập với tài khoản **admin** → Thấy tất cả menu

### 4. Test profile management
1. Vào trang Profile
2. Upload avatar → Xem ảnh hiển thị
3. Chỉnh sửa tên, email → Lưu
4. Đổi mật khẩu → Logout → Login lại với mật khẩu mới

## 🎯 Tips

- Access token hết hạn sau **15 phút**
- Refresh token hết hạn sau **7 ngày**
- Tất cả requests đều tự động thêm Authorization header
- Không cần lo logout khi token hết hạn, hệ thống tự động refresh
- Admin có thể vô hiệu hóa user bằng nút toggle trong User Management

## 📞 Liên hệ

Nếu có vấn đề, liên hệ team phát triển!

---

Made with ❤️ by Group 10
\`\`\`
