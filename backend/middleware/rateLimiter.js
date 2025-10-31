import rateLimit from "express-rate-limit";

/**
 * Rate Limiter cho Login - Chống brute force
 * Giới hạn: 5 requests / 15 phút
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 requests
  message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log("🚫 Rate limit exceeded for IP:", req.ip);
    res.status(429).json({
      message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
      retryAfter: "15 phút"
    });
  }
});

/**
 * Rate Limiter cho Register
 * Giới hạn: 3 requests / 1 giờ
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3,
  message: "Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ.",
  handler: (req, res) => {
    console.log("🚫 Register rate limit exceeded for IP:", req.ip);
    res.status(429).json({
      message: "Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ."
    });
  }
});

/**
 * Rate Limiter cho Forgot Password
 * Giới hạn: 2 requests / 1 phút (để test dễ)
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút (đổi thành 60 * 60 * 1000 cho production)
  max: 2, // Giới hạn 2 lần (đổi thành 3 cho production)
  message: "Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 phút.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    console.log("📊 Forgot Password Rate Limiter:");
    console.log("- IP:", req.ip);
    console.log("- Path:", req.path);
    console.log("- Current count: checking...");
    return false; // Don't skip
  },
  handler: (req, res) => {
    console.log("🚫 RATE LIMIT EXCEEDED!");
    console.log("- IP:", req.ip);
    console.log("- Limit: 2 requests per minute");
    res.status(429).json({
      message: "Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 phút.",
      retryAfter: "1 phút"
    });
  }
});

/**
 * Rate Limiter cho Avatar Upload
 * Giới hạn: 10 requests / 1 giờ
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Quá nhiều lần upload. Vui lòng thử lại sau 1 giờ.",
  handler: (req, res) => {
    console.log("🚫 Upload rate limit exceeded for IP:", req.ip);
    res.status(429).json({
      message: "Quá nhiều lần upload. Vui lòng thử lại sau 1 giờ."
    });
  }
});

/**
 * General API Rate Limiter
 * Giới hạn: 100 requests / 15 phút
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Quá nhiều requests. Vui lòng thử lại sau.",
  standardHeaders: true,
  legacyHeaders: false
});

