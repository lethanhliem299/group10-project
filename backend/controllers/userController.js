let users = [
  { id: 1, name: "Liem", email: "liem@example.com" },
  { id: 2, name: "Yen", email: "yen@example.com" }
];

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
