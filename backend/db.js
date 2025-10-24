const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://tieuyen0704_db_user:vanvi2112@cluster0.rljpp3t.mongodb.net/group10?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });code backend/testRefreshToken.js


    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
