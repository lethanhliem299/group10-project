#!/bin/bash

# ========================================
# Git Commands cho SV3 (Database & Integration)
# ========================================

echo "🚀 SV3 - Database & Integration Specialist"
echo "=========================================="
echo ""

# Activity 4: Forgot Password & Reset Password
echo "📝 Activity 4: Forgot Password & Reset Password"
git checkout main
git pull origin main
git checkout -b feature/forgot-password
git add backend/package.json backend/utils/emailService.js backend/models/User.js backend/controllers/passwordController.js backend/routes/passwordRoutes.js backend/server.js backend/pro.env backend/test-forgot-password.md
git commit -m "feat: Add Forgot Password & Reset Password with Email

- Add dependencies: nodemailer, crypto, dotenv
- Create emailService with Gmail SMTP
- Update User model with reset token fields
- Create passwordController (forgot, verify, reset, change)
- Create passwordRoutes
- Update server.js
- Update pro.env with email config
- Add test documentation

Activity 4: Forgot Password (SV3)"
git push origin feature/forgot-password
echo "✅ Activity 4 completed!"
echo ""

# Activity 5: Activity Logging & Rate Limiting
echo "📝 Activity 5: Activity Logging & Rate Limiting"
git checkout main
git pull origin main
git checkout -b feature/log-rate-limit
git add backend/package.json backend/models/ActivityLog.js backend/middleware/logActivity.js backend/middleware/rateLimiter.js backend/controllers/activityLogController.js backend/routes/logRoutes.js backend/server.js backend/test-logging-ratelimit.md
git commit -m "feat: Add Activity Logging & Rate Limiting

- Add dependency: express-rate-limit
- Create ActivityLog model with TTL
- Create logRequest middleware
- Create rateLimiter middleware (5 types)
- Create activityLogController (getAllLogs, getUserLogs, getMyLogs, getLogStats, clearOldLogs)
- Create logRoutes
- Update server.js with global middleware
- Add test documentation

Activity 5: Logging & Rate Limiting (SV3)"
git push origin feature/log-rate-limit
echo "✅ Activity 5 completed!"
echo ""

echo "🎉 SV3 đã hoàn thành tất cả tasks!"
echo "=================================="
echo "✅ Activity 4: Forgot Password & Email"
echo "✅ Activity 5: Logging & Rate Limiting"
echo ""
echo "📌 Next steps:"
echo "1. Tạo Pull Requests cho từng branch"
echo "2. Review code"
echo "3. Test email service (Gmail SMTP)"
echo "4. Test rate limiting"
echo "5. Merge vào main sau khi approved"

