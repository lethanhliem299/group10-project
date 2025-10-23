const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, 'pro.env') });

const authRoutes = require('./routes/authRoutes');
const refreshRoutes = require("./routes/refreshRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.log('❌ Lỗi MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/auth', refreshRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại cổng ${PORT}`));
