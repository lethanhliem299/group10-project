const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: 18 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

// Định nghĩa schema người dùng
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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

// Xuất model để sử dụng ở nơi khác
module.exports = mongoose.model('User', userSchema);
