const express = require('express');
database
const cors = require('cors');
const connectDB = require('./db');       
const User = require('./models/User');   
const app = express();

connectDB();

app.use(cors());
app.use(express.json());  // Để parse JSON body từ request

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Lấy tất cả user từ DB
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

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

const app = express();

// Middleware để parse JSON
app.use(express.json());

// Import router
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 backend
});
