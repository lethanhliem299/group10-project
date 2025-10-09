const mongoose = require('mongoose');

// URL kết nối MongoDB (bạn có thể đổi tên database ở cuối)
const MONGO_URI = 'mongodb://127.0.0.1:27017/group10db';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
