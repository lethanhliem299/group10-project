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
