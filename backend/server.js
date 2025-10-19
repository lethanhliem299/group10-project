// ====== IMPORT ======
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ====== LOAD ENV ======
dotenv.config({ path: __dirname + '/pro.env' });

// ====== INIT APP ======
const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== CONNECT MONGODB ======
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ====== ROUTES ======
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ====== TEST ROUTE ======
app.get('/', (req, res) => res.send('🚀 Server đang chạy tại cổng 5000'));

// ====== START SERVER ======
const PORT = 5000; // cổng 5000
app.listen(PORT, () => console.log(`🚀 Server đang chạy tại cổng ${PORT}`));
