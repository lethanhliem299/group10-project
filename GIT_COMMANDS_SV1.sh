#!/bin/bash

# ========================================
# Git Commands cho SV1 (Backend Advanced)
# ========================================

echo "🚀 SV1 - Backend Advanced Developer"
echo "======================================"
echo ""

# Activity 1: Refresh Token & Session Management
echo "📝 Activity 1: Refresh Token & Session Management"
git checkout -b feature/refresh-token
git add backend/models/RefreshToken.js backend/utils/jwt.js backend/controllers/authController.js backend/middleware/verifyToken.js backend/routes/authRoutes.js backend/package.json backend/test-refresh-token.md backend/pro.env .gitignore
git commit -m "feat: Add Refresh Token & Session Management

- Create RefreshToken model with TTL index
- Add JWT utility functions
- Update authController with refresh, logout, logoutAll
- Create verifyToken middleware
- Update authRoutes
- Add test documentation

Activity 1: Refresh Token (SV1)"
git push origin feature/refresh-token
echo "✅ Activity 1 completed!"
echo ""

# Activity 2: Advanced RBAC
echo "📝 Activity 2: Advanced RBAC"
git checkout main
git pull origin main
git checkout -b feature/rbac
git add backend/models/User.js backend/middleware/checkRole.js backend/controllers/adminController.js backend/routes/adminRoutes.js backend/routes/moderatorRoutes.js backend/server.js backend/test-rbac.md
git commit -m "feat: Add Advanced RBAC (Role-Based Access Control)

- Update User schema with role enum and isActive
- Create checkRole middleware
- Create adminController (CRUD users)
- Create adminRoutes and moderatorRoutes
- Update server.js
- Add test documentation

Activity 2: RBAC (SV1)"
git push origin feature/rbac
echo "✅ Activity 2 completed!"
echo ""

# Activity 3: Avatar Upload
echo "📝 Activity 3: Avatar Upload with Cloudinary"
git checkout main
git pull origin main
git checkout -b feature/avatar-upload
git add backend/package.json backend/config/cloudinary.js backend/middleware/uploadAvatar.js backend/controllers/avatarController.js backend/models/User.js backend/routes/user.js backend/pro.env backend/test-avatar-upload.md
git commit -m "feat: Add Avatar Upload with Cloudinary

- Add dependencies: cloudinary, multer, sharp, dotenv
- Create Cloudinary config
- Create uploadAvatar middleware (Multer + Sharp)
- Create avatarController
- Update User model with avatar fields
- Add avatar routes
- Add test documentation

Activity 3: Avatar Upload (SV1)"
git push origin feature/avatar-upload
echo "✅ Activity 3 completed!"
echo ""

echo "🎉 SV1 đã hoàn thành tất cả tasks!"
echo "=================================="
echo "✅ Activity 1: Refresh Token"
echo "✅ Activity 2: RBAC"
echo "✅ Activity 3: Avatar Upload"
echo ""
echo "📌 Next steps:"
echo "1. Tạo Pull Requests cho từng branch"
echo "2. Review code"
echo "3. Merge vào main sau khi approved"
