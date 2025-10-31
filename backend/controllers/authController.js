import User from "../models/User.js";
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens
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
      role: role || "user"
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

    // Tạo Access Token
    const accessToken = generateAccessToken(user._id, user.role);

    // Tạo Refresh Token và lưu vào DB
    const deviceInfo = {
      userAgent: req.headers["user-agent"] || "unknown",
      ip: req.ip || req.connection.remoteAddress
    };
    const refreshToken = await generateRefreshToken(user._id, deviceInfo);

    res.json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
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

/**
 * Refresh Access Token
 * POST /auth/refresh
 * Body: { refreshToken }
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token không được cung cấp" });
    }

    // Xác thực refresh token
    const tokenData = await verifyRefreshToken(refreshToken);

    // Tạo access token mới
    const user = await User.findById(tokenData.userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({
      message: "Refresh token thành công",
      accessToken: newAccessToken
    });
  } catch (err) {
    res.status(401).json({ message: err.message || "Refresh token không hợp lệ" });
  }
};

/**
 * Logout (Thu hồi một refresh token)
 * POST /auth/logout
 * Body: { refreshToken }
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token không được cung cấp" });
    }

    const revoked = await revokeRefreshToken(refreshToken);

    if (!revoked) {
      return res.status(404).json({ message: "Refresh token không tồn tại" });
    }

    res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * Logout All Devices (Thu hồi tất cả refresh token của user)
 * POST /auth/logout-all
 * Headers: Authorization: Bearer {accessToken}
 */
export const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware verifyToken

    const count = await revokeAllUserTokens(userId);

    res.json({ 
      message: "Đăng xuất tất cả thiết bị thành công", 
      revokedTokens: count 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
