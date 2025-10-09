const express = require('express');
const connectDB = require('./db');
const mongoose = require('mongoose');
const cors = require('cors');


connectDB();

const app = express();
app.use(cors());
app.use(express.json());


const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});
const User = mongoose.model('User', UserSchema);

// Route test
app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});


app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

