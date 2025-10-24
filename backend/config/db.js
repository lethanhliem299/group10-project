const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 👉 Kết nối tới MongoDB Atlas bằng tài khoản của bạn
    const uri = "mongodb+srv://tieuyen:vanvi2112@cluster0.saieuiq.mongodb.net/group10?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
