import User from "../models/User.js";

// ============================
// Lấy profile user hiện tại
// ============================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ============================
// Cập nhật profile user
// ============================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const { name, email } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ 
      message: "Cập nhật profile thành công", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ============================
// Thay đổi mật khẩu
// ============================
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const { oldPassword, newPassword } = req.body;

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    user.password = newPassword; // sẽ được hash trong pre-save hook
    await user.save();

    res.json({ message: "Cập nhật mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
