import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  refresh,
  logout,
  logoutAll,
} from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// =======================
// AUTH ROUTES (with rate limiting)
// =======================
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", verifyToken, logoutAll);

// =======================
// PROFILE ROUTES
// =======================
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
