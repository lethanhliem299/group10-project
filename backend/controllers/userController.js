// controllers/userController.js
const users = [
  { id: 1, name: "Thanh Liêm", email: "thanhliem0789656081@gmail.com" },
  { id: 2, name: "Yen", email: "yen@example.com" }
];

// GET /users
const getUsers = (req, res) => {
  res.json(users);
};

// POST /users
const createUser = (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };
