const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { signup, login, refreshToken } = require('../controllers/authController');
const User = require('../models/User');

// Upload file cấu hình
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  const user = await User.findById(req.user.id);
  user.avatar = req.file.path;
  await user.save();
  res.json({ message: 'Upload ảnh thành công', avatar: user.avatar });
});

module.exports = router;
