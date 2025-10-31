# 🚀 HƯỚNG DẪN DEPLOY HỆ THỐNG

## 📋 Tổng quan
- **Frontend**: Deploy lên Vercel
- **Backend**: Deploy lên Render
- **Database**: MongoDB Atlas

---

## 1️⃣ DEPLOY DATABASE - MongoDB Atlas

### Bước 1: Tạo MongoDB Atlas Cluster
1. Truy cập: https://cloud.mongodb.com
2. Đăng nhập hoặc tạo account mới
3. Click **"Create"** → **"Build a Database"**
4. Chọn **"M0 FREE"** → Click **"Create"**
5. Chọn Region gần Việt Nam (Singapore)
6. Cluster Name: `group10-cluster`

### Bước 2: Tạo Database User
1. Click **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `group10_admin`
4. Password: Tạo password mạnh (lưu lại)
5. Database User Privileges: **"Atlas admin"**
6. Click **"Add User"**

### Bước 3: Whitelist IP Address
1. Click **"Network Access"**
2. Click **"Add IP Address"**
3. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Bước 4: Lấy Connection String
1. Click **"Database"** → Click **"Connect"**
2. Chọn **"Connect your application"**
3. Copy connection string:
```
mongodb+srv://group10_admin:<password>@group10-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. Thay `<password>` bằng password thật

---

## 2️⃣ DEPLOY BACKEND - Render

### Bước 1: Push code lên GitHub
```bash
cd D:\backend\group10-project
git add .
git commit -m "chore: Prepare for deployment"
git push origin main
```

### Bước 2: Tạo Web Service trên Render
1. Truy cập: https://render.com
2. Đăng nhập bằng GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect repository: **"group10-project"**
5. Click **"Connect"**

### Bước 3: Cấu hình Web Service
```
Name: group10-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Bước 4: Thêm Environment Variables
Click **"Environment"** → **"Add Environment Variable"**

```bash
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://group10_admin:YOUR_PASSWORD@group10-cluster.xxxxx.mongodb.net/group10?retryWrites=true&w=majority

# JWT Secrets (tạo random string)
JWT_SECRET=your_random_jwt_secret_key_12345678
REFRESH_TOKEN_SECRET=your_random_refresh_token_secret_12345678

# Cloudinary
CLOUDINARY_CLOUD_NAME=dnc6gvmyn
CLOUDINARY_API_KEY=167435299519773
CLOUDINARY_API_SECRET=EKjBHntUS3B3xk0Gb0rHkqr8LRI

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tieuyen0704@gmail.com
EMAIL_PASSWORD=rwpwdjubkypdlmzf
EMAIL_FROM=User Management System

# Frontend URL (sẽ update sau khi deploy frontend)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Bước 5: Deploy
1. Click **"Create Web Service"**
2. Đợi build và deploy (3-5 phút)
3. Copy Backend URL: `https://group10-backend.onrender.com`

---

## 3️⃣ DEPLOY FRONTEND - Vercel

### Bước 1: Update API URL trong Frontend
Tạo file `frontend/.env.production`:
```bash
REACT_APP_API_URL=https://group10-backend.onrender.com
```

### Bước 2: Update Frontend Code
Cập nhật tất cả `API_URL` trong frontend:
- `src/pages/Login.js`
- `src/pages/Register.js`
- `src/pages/ForgotPassword.js`
- `src/pages/ResetPassword.js`
- `src/utils/axiosConfig.js`
- `src/components/Navbar.js`

Đổi từ:
```javascript
const API_URL = "http://localhost:5000";
```

Thành:
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

### Bước 3: Push code
```bash
git add .
git commit -m "chore: Update API URL for production"
git push origin main
```

### Bước 4: Deploy lên Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"Add New..."** → **"Project"**
4. Import repository: **"group10-project"**
5. Click **"Import"**

### Bước 5: Cấu hình Vercel
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Bước 6: Add Environment Variables
```bash
REACT_APP_API_URL=https://group10-backend.onrender.com
```

### Bước 7: Deploy
1. Click **"Deploy"**
2. Đợi build (2-3 phút)
3. Copy Frontend URL: `https://group10-project.vercel.app`

---

## 4️⃣ CẬP NHẬT CORS & FRONTEND_URL

### Update Backend Environment Variables
Quay lại Render → Environment Variables:
```bash
FRONTEND_URL=https://group10-project.vercel.app
```

### Update Backend CORS
File `backend/server.js` đã có CORS config:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
```

### Redeploy Backend
1. Vào Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 5️⃣ TEST HỆ THỐNG PRODUCTION

### Test Frontend
1. Truy cập: `https://group10-project.vercel.app`
2. Test đăng ký user mới
3. Test đăng nhập
4. Test các tính năng

### Test Backend API
Dùng Postman:
```
POST https://group10-backend.onrender.com/auth/register
POST https://group10-backend.onrender.com/auth/login
GET https://group10-backend.onrender.com/auth/profile
```

---

## 6️⃣ MONITORING & LOGS

### Xem Backend Logs (Render)
1. Vào Render Dashboard
2. Chọn Web Service
3. Click tab **"Logs"**

### Xem Frontend Logs (Vercel)
1. Vào Vercel Dashboard
2. Chọn Project
3. Click **"Deployments"** → Chọn deployment → **"View Function Logs"**

---

## 🎯 URLs PRODUCTION

| Service | URL |
|---------|-----|
| Frontend | https://group10-project.vercel.app |
| Backend | https://group10-backend.onrender.com |
| Database | MongoDB Atlas Cluster |
| API Docs | https://group10-backend.onrender.com/api-docs |

---

## ⚠️ LƯU Ý

### Free Tier Limitations:
- **Render Free**: Server ngủ sau 15 phút không hoạt động (cold start ~30s)
- **Vercel Free**: 100GB bandwidth/tháng
- **MongoDB Atlas Free**: 512MB storage

### Security:
- ❌ KHÔNG commit file `.env` lên GitHub
- ✅ Dùng Environment Variables trên Render/Vercel
- ✅ Dùng strong JWT secrets
- ✅ Dùng Gmail App Password (không dùng password thật)

### Performance:
- First request có thể chậm (cold start)
- Sau đó sẽ nhanh hơn
- Có thể upgrade plan nếu cần

---

## 🔧 TROUBLESHOOTING

### Backend không kết nối được Database
- Kiểm tra MongoDB Atlas connection string
- Kiểm tra IP Whitelist (allow 0.0.0.0/0)
- Kiểm tra database user credentials

### Frontend không gọi được Backend API
- Kiểm tra REACT_APP_API_URL
- Kiểm tra CORS settings trên backend
- Xem browser console logs

### Email không gửi được
- Kiểm tra Gmail App Password
- Kiểm tra 2-Step Verification enabled
- Test với Postman trước

---

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Check logs trên Render/Vercel
2. Test API với Postman
3. Xem documentation
4. Google search error message

---

**Chúc bạn deploy thành công! 🚀**

