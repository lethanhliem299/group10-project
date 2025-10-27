import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/checkRole.js";
import User from "../models/User.js";

const router = express.Router();

// -------------------
// Lấy danh sách tất cả user (Admin)
// -------------------
router.get("/", authenticate, checkRole(["Admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// -------------------
// Lấy thông tin user theo id (Admin hoặc chính user)
// -------------------
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "Admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// -------------------
// Cập nhật thông tin user (Admin hoặc chính user)
// -------------------
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "Admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const { name, email, role } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === "Admin") user.role = role; // chỉ admin có quyền thay role

    await user.save();

    res.json({
      message: "Cập nhật user thành công",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// -------------------
// Xóa user (Admin)
// -------------------
router.delete("/:id", authenticate, checkRole(["Admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    await user.remove();

    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

export default router;
