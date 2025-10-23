const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");

// ✅ Refresh Access Token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) return res.status(403).json({ message: "Refresh token không hợp lệ" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Refresh token hết hạn hoặc không hợp lệ" });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User không tồn tại" });

      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({
        accessToken,
        message: "Access token mới đã được cấp"
      });
    });
  } catch (error) {
    console.error("Refresh token lỗi:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
