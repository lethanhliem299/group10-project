const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPw });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH, { expiresIn: '7d' });

    return res.status(201).json({ message: 'Đăng ký thành công', accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu!' });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH, { expiresIn: '7d' });

    return res.json({ message: 'Đăng nhập thành công', accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json({ message: 'Chưa có Refresh Token!' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: 'Refresh Token không hợp lệ!' });
  }
};
