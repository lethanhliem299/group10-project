const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Không có token, truy cập bị từ chối!" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ hoặc hết hạn!" });

    req.user = decoded; // lưu thông tin user từ token vào req.user
    next();
  });
};

module.exports = verifyToken;
