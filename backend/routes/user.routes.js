const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const checkRole = require("../middleware/checkRole");

// Lấy danh sách tất cả user - chỉ admin được phép
router.get("/", checkRole(["Admin"]), async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // loại bỏ trường password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Cập nhật role user - chỉ admin được phép
router.put("/:id/role", checkRole(["Admin"]), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["User", "Moderator", "Admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
