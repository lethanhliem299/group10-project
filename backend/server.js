HEAD
// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/group10", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🧩 Schema và Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// 🧠 API ROUTES
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.json(newUser);
});

// 🚀 Khởi động server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// ==========================
// server.js - Backend chính
// ==========================

// 1. Import thư viện cần thiết
const express = require('express');
const cors = require('cors');

// 2. Khởi tạo ứng dụng Express
const app = express();

// 3. Cấu hình middleware
app.use(cors()); // Cho phép truy cập từ frontend
app.use(express.json()); // Cho phép đọc dữ liệu JSON trong body

// 4. Import router người dùng (user routes)
const userRoutes = require('./routes/user');

// 5. Sử dụng route
app.use('/users', userRoutes);

// 6. Trang mặc định (root)
app.get('/', (req, res) => {
  res.send('✅ Backend server is running successfully!');
});

// 7. Chạy server
const PORT = 3000; // có thể đổi sang 5000 nếu cần
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
backend
