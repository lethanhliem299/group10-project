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

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", verifyToken, logoutAll);

// Profile routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

export default router;
