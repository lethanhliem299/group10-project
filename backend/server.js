const express = require('express');
const cors = require('cors');
const connectDB = require('./db');       // File db.js để kết nối MongoDB
const User = require('./models/User');   // Model User.js trong thư mục models

const app = express();

// Kết nối database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());  // Để parse JSON body từ request

// Route test server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// GET tất cả users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Lấy tất cả user từ DB
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST thêm user mới
app.post('/users', async (req, res) => {
  try {
    console.log('Received POST /users with body:', req.body);
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Bad request' });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
