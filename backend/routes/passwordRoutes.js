import express from "express";
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
} from "../controllers/passwordController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (không cần authentication)
router.post("/forgot-password", forgotPassword);
router.get("/verify-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// Protected route (cần authentication)
router.post("/change-password", authenticate, changePassword);

export default router;

