const mongoose = require('mongoose');

// Tạo schema cho User
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user' // 'user' hoặc 'admin'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
