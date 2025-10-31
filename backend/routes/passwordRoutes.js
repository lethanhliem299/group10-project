import express from "express";
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword
} from "../controllers/passwordController.js";
import verifyToken from "../middleware/verifyToken.js";
import { forgotPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Public routes (with rate limiting)
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Protected route (user đã đăng nhập)
router.post("/change-password", verifyToken, changePassword);

export default router;

