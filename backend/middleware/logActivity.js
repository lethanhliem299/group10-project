import ActivityLog from "../models/ActivityLog.js";

/**
 * Middleware để log mọi activity của user
 */
export const logActivity = async (req, res, next) => {
  // Lưu original res.json để wrap
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    // Log activity sau khi response
    setImmediate(async () => {
      try {
        const action = determineAction(req);
        const status = res.statusCode < 400 ? "SUCCESS" : "FAILED";

        const logData = {
          userId: req.user?.id || null,
          email: req.user?.email || req.body?.email || null,
          action,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
          status,
          details: `${req.method} ${req.originalUrl} - Status: ${res.statusCode}`,
          timestamp: new Date()
        };

        await ActivityLog.create(logData);
        console.log(`📝 Activity logged: ${action} by ${logData.email || 'Anonymous'} - ${status}`);
      } catch (err) {
        console.error("❌ Error logging activity:", err.message);
      }
    });

    // Gọi original res.json
    return originalJson(data);
  };

  next();
};

/**
 * Xác định action dựa trên route và method
 */
function determineAction(req) {
  const { method, path } = req;

  // Auth routes
  if (path.includes("/login")) return req.body?.email && res.statusCode === 200 ? "LOGIN" : "FAILED_LOGIN";
  if (path.includes("/logout")) return "LOGOUT";
  if (path.includes("/register")) return "REGISTER";
  if (path.includes("/refresh")) return "TOKEN_REFRESH";

  // Password routes
  if (path.includes("/forgot-password")) return "FORGOT_PASSWORD";
  if (path.includes("/reset-password")) return "RESET_PASSWORD";
  if (path.includes("/change-password")) return "PASSWORD_CHANGE";

  // Profile routes
  if (path.includes("/profile") && method === "PUT") return "PROFILE_UPDATE";

  // Avatar routes
  if (path.includes("/avatar") && method === "POST") return "AVATAR_UPLOAD";
  if (path.includes("/avatar") && method === "DELETE") return "AVATAR_DELETE";

  // Admin routes
  if (path.includes("/admin/users") && method === "POST") return "USER_CREATE";
  if (path.includes("/admin/users") && method === "PUT") return "USER_UPDATE";
  if (path.includes("/admin/users") && method === "DELETE") return "USER_DELETE";

  return `${method}_${path}`;
}

/**
 * Helper function để log activity thủ công
 */
export const createLog = async (userId, email, action, req, status = "SUCCESS", details = "") => {
  try {
    await ActivityLog.create({
      userId,
      email,
      action,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      status,
      details,
      timestamp: new Date()
    });
    console.log(`📝 Manual log: ${action} by ${email} - ${status}`);
  } catch (err) {
    console.error("❌ Error creating log:", err.message);
  }
};

