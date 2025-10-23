const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken"); // SV3 đã làm

exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Không có refresh token!" });

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) return res.status(403).json({ message: "Refresh token không hợp lệ!" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Refresh token hết hạn!" });

        const accessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({
            message: "Refresh token thành công!",
            accessToken
        });
    });
};
