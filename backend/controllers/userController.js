let users = [
  { id: 1, name: "Liêm", email: "liem@example.com" },
  { id: 2, name: "Yến", email: "yen@example.com" }
];

// GET /users - Lấy danh sách user
exports.getUsers = (req, res) => {
  res.status(200).json(users);
};

// POST /users - Thêm user mới
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Thiếu name hoặc email" });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ message: "Thêm user thành công", user: newUser });
};

// PUT /users/:id - Cập nhật user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users.find(u => u.id === parseInt(id));
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  user.name = name || user.name;
  user.email = email || user.email;

  res.json({ message: "Cập nhật user thành công", user });
};

// DELETE /users/:id - Xóa user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index === -1) return res.status(404).json({ message: "Không tìm thấy user" });

  users.splice(index, 1);
  res.json({ message: "Xóa user thành công" });
};
