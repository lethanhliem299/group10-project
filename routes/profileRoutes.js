const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware xác thực token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Không có token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
}

router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ name: user.name, email: user.email, role: user.role });
});

module.exports = router;
