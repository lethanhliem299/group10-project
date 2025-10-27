import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Lấy profile người dùng
router.get("/", authenticate, async (req, res) => {
  const { name, email, role } = req.user;
  res.json({ name, email, role });
});

// Cập nhật profile
router.put("/", authenticate, async (req, res) => {
  const { name, email } = req.body;
  if (name) req.user.name = name;
  if (email) req.user.email = email;
  await req.user.save();
  res.json({ message: "Profile updated", profile: { name: req.user.name, email: req.user.email, role: req.user.role } });
});

export default router;
