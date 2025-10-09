const express = require('express');

const app = express();

// Middleware để parse JSON
app.use(express.json());

// Import router
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
