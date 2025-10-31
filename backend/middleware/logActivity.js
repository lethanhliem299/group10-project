import ActivityLog from "../models/ActivityLog.js";

// Middleware để log mọi request
const logRequest = async (req, res, next) => {
  // Lưu thời gian bắt đầu request
  const startTime = Date.now();

  // Override res.json để capture status code
  const originalJson = res.json.bind(res);
  res.json = function (data) {
    res.locals.responseData = data;
    return originalJson(data);
  };

  // Khi response kết thúc, lưu log
  res.on("finish", async () => {
    try {
      const logData = {
        userId: req.user?.id || null,
        action: `${req.method} ${req.originalUrl}`,
        method: req.method,
        endpoint: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"],
        timestamp: new Date(),
      };

      await ActivityLog.create(logData);

      // Log ra console cho development
      const duration = Date.now() - startTime;
      console.log(
        `[${logData.timestamp.toISOString()}] ${logData.method} ${logData.endpoint} - ${logData.statusCode} - ${duration}ms - ${logData.ip}`
      );
    } catch (error) {
      console.error("❌ Error logging activity:", error.message);
    }
  });

  next();
};

export default logRequest;

