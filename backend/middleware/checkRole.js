function checkRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // req.user đã được gán trong middleware xác thực JWT
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Access is denied." });
    }
    next();
  };
}

module.exports = checkRole;
