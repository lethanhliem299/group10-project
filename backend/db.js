const mongoose = require('mongoose');

// URL kết nối MongoDB Atlas (thay user, pass, cluster, dbname đúng của bạn)
const MONGO_URI = 'mongodb+srv://tieuyen:Yen0407@cluster0.saieuiq.mongodb.net/group10db?retryWrites=true&w=majority';

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
