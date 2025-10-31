import express from "express";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Middleware kiểm tra role admin
const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
  }
  next();
};

// ==========================================
// GET /admin/users - Lấy tất cả users
// ==========================================
router.get("/users", verifyToken, checkAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==========================================
// GET /admin/users/:id - Lấy thông tin user theo ID
// ==========================================
router.get("/users/:id", verifyToken, checkAdmin, async (req, res) => {
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

// ==========================================
// PUT /admin/users/:id - Cập nhật user
// ==========================================
router.put("/users/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: "Cập nhật thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==========================================
// DELETE /admin/users/:id - Xóa user
// ==========================================
router.delete("/users/:id", verifyToken, checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Không cho phép xóa chính mình
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Không thể xóa chính mình" });
    }

    await User.findByIdAndDelete(req.params.id);
    
    // Xóa tất cả refresh tokens của user
    await RefreshToken.deleteMany({ userId: req.params.id });

    res.json({ message: "Đã xóa người dùng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==========================================
// PATCH /admin/users/:id/toggle-active - Kích hoạt/vô hiệu hóa user
// ==========================================
router.patch("/users/:id/toggle-active", verifyToken, checkAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Không cho phép vô hiệu hóa chính mình
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Không thể vô hiệu hóa chính mình" });
    }

    user.isActive = isActive;
    await user.save();

    // Nếu vô hiệu hóa, xóa tất cả refresh tokens
    if (!isActive) {
      await RefreshToken.deleteMany({ userId: user._id });
    }

    res.json({
      message: isActive ? "Đã kích hoạt người dùng" : "Đã vô hiệu hóa người dùng",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==========================================
// GET /admin/users/:id/sessions - Xem sessions của user
// ==========================================
router.get("/users/:id/sessions", verifyToken, checkAdmin, async (req, res) => {
  try {
    const sessions = await RefreshToken.find({ userId: req.params.id })
      .sort({ createdAt: -1 });
    
    res.json({
      userId: req.params.id,
      totalSessions: sessions.length,
      sessions: sessions.map(s => ({
        token: s.token.substring(0, 20) + "...",
        deviceInfo: s.deviceInfo,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ==========================================
// DELETE /admin/users/:id/sessions - Xóa tất cả sessions của user
// ==========================================
router.delete("/users/:id/sessions", verifyToken, checkAdmin, async (req, res) => {
  try {
    const result = await RefreshToken.deleteMany({ userId: req.params.id });
    
    res.json({
      message: "Đã xóa tất cả phiên đăng nhập",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

export default router;

