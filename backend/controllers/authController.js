import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra user đã tồn tại chưa
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Người dùng đã tồn tại" });

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      role: role || "User"
    });

    res.status(201).json({ 
      message: "Đăng ký thành công", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại" });

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // hash sẽ tự động trong pre-save hook

    await user.save();

    res.json({ 
      message: "Cập nhật thành công", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
