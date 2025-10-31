import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
} from "../utils/jwt.js";

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

    // Generate Access Token & Refresh Token
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = await generateRefreshToken(user._id, {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    res.json({
      accessToken,
      refreshToken,
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

// Refresh Token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const tokenData = await verifyRefreshToken(refreshToken);
    const user = await User.findById(tokenData.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Logout (revoke 1 token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    await revokeRefreshToken(refreshToken);

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Logout All (revoke tất cả token của user)
export const logoutAll = async (req, res) => {
  try {
    await revokeAllUserTokens(req.user.id);

    res.json({ message: "Logged out from all devices" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
