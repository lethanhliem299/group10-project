const mongoose = require('mongoose');

// 🧩 Định nghĩa cấu trúc dữ liệu người dùng (User)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  age: {
    type: Number,
    default: 18
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🧠 Xuất model User để dùng ở nơi khác
module.exports = mongoose.model('User', userSchema);
