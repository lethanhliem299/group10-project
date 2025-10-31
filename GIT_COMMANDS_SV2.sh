#!/bin/bash

# ========================================
# Git Commands cho SV2 (Frontend Advanced)
# ========================================

echo "🚀 SV2 - Frontend Advanced Developer"
echo "====================================="
echo ""

# Activity 6: Redux Toolkit & Protected Routes
echo "📝 Activity 6: Redux Toolkit & Protected Routes"
git checkout main
git pull origin main
git checkout -b feature/redux-protected
git add FRONTEND_GUIDE_SV2.md
git commit -m "feat: Add Frontend Guide - Redux Toolkit & Protected Routes

- Create comprehensive guide for Frontend Developer
- Redux Toolkit setup (store, auth slice, async thunks)
- API Service with Axios (auto refresh token interceptor)
- Protected Routes (authentication & role-based authorization)
- React Router setup (public & protected routes)
- Pages implementation (Login, Register, Dashboard, Profile, AdminPanel)
- Components (Navbar, role-based UI)
- Styling with CSS
- Complete demo flow and testing instructions
- Git commands and package.json

Activity 6: Redux & Protected Routes (SV2)"
git push origin feature/redux-protected
echo "✅ Activity 6 completed!"
echo ""

echo "🎉 SV2 đã hoàn thành frontend guide!"
echo "===================================="
echo "✅ Activity 6: Redux & Protected Routes Guide"
echo ""
echo "📌 Next steps:"
echo "1. Follow FRONTEND_GUIDE_SV2.md để implement frontend"
echo "2. Setup React app trong folder frontend/"
echo "3. Install dependencies:"
echo "   npm install @reduxjs/toolkit react-redux react-router-dom axios"
echo "4. Implement theo từng bước trong guide"
echo "5. Test authentication flow"
echo "6. Test protected routes"
echo "7. Test auto refresh token"
echo "8. Tạo Pull Request"
echo ""
echo "📁 Cấu trúc Frontend:"
echo "frontend/"
echo "├── src/"
echo "│   ├── app/store.js                   # Redux store"
echo "│   ├── features/auth/authSlice.js     # Auth reducer"
echo "│   ├── services/api.js                # Axios + interceptors"
echo "│   ├── components/ProtectedRoute.jsx  # Protected route"
echo "│   ├── components/Navbar.jsx          # Navigation"
echo "│   ├── pages/Login.jsx                # Login page"
echo "│   ├── pages/Register.jsx             # Register page"
echo "│   ├── pages/Dashboard.jsx            # Dashboard"
echo "│   ├── pages/Profile.jsx              # Profile page"
echo "│   ├── pages/AdminPanel.jsx           # Admin panel"
echo "│   └── App.js                         # Main app"
echo "└── package.json"

