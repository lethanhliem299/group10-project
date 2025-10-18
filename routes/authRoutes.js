const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// ====== SIGNUP ======
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, age } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role: role || 'user', age: age || 18 });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'Đăng ký thành công', token, user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// ====== FORGOT PASSWORD ======
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Token reset mật khẩu', resetToken });
});

// ====== RESET PASSWORD ======
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch {
    res.status(400).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
});

// ====== UPLOAD AVATAR ======
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${req.user.id}-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User không tồn tại' });

  user.avatar = req.file.path;
  await user.save();
  res.json({ message: 'Upload thành công', avatar: user.avatar });
});

module.exports = router;
