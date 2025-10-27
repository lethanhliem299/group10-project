let users = [
  { id: 1, name: "Liem", email: "liem@example.com", role: "Admin" },
  { id: 2, name: "Luan", email: "luan@example.com", role: "Moderator" },
  { id: 3, name: "An", email: "an@example.com", role: "User" },
];

// GET all users (Admin & Moderator)
exports.getUsers = (req, res) => {
  res.json(users);
};

// GET own profile (User)
exports.getProfile = (req, res) => {
  const user = users.find(u => u.email === req.user.email);
  res.json(user);
};

// POST - tạo user (Admin)
exports.createUser = (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.json(newUser);
};

// PUT - cập nhật user (Admin)
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id == id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// DELETE - xóa user (Admin)
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id != id);
  res.json({ message: "User deleted" });
};
