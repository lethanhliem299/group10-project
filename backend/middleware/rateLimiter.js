import rateLimit from "express-rate-limit";

// Rate limiter cho login (chống brute force)
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Giới hạn 5 requests
  message: {
    message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests (chỉ đếm failed requests)
  skipSuccessfulRequests: true,
});

// Rate limiter cho register
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Giới hạn 3 lần đăng ký
  message: {
    message: "Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho forgot password (chống spam email)
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Giới hạn 3 lần request
  message: {
    message: "Quá nhiều yêu cầu reset password. Vui lòng thử lại sau 1 giờ.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho upload (chống spam upload)
export const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Giới hạn 10 uploads
  message: {
    message: "Quá nhiều lần upload. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter chung cho tất cả API
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 requests
  message: {
    message: "Quá nhiều requests. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  loginRateLimiter,
  registerRateLimiter,
  forgotPasswordRateLimiter,
  uploadRateLimiter,
  apiRateLimiter,
};

