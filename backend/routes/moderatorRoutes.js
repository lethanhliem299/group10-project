import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Middleware kiểm tra role admin hoặc moderator
const checkAdminOrModerator = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "moderator") {
    return res.status(403).json({ message: "Chỉ admin và moderator mới có quyền truy cập" });
  }
  next();
};

// ==========================================
// GET /moderator/users - Xem danh sách users (read-only)
// ==========================================
router.get("/users", verifyToken, checkAdminOrModerator, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==========================================
// GET /moderator/users/:id - Xem chi tiết user (read-only)
// ==========================================
router.get("/users/:id", verifyToken, checkAdminOrModerator, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

export default router;

