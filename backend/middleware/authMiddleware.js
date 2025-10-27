import jwt from "jsonwebtoken";

// =========================
// Authenticate Middleware
// =========================
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret"); // bạn có thể chuyển thành process.env.JWT_SECRET
    req.user = decoded; // { id: ..., role: ... }

    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};

// =========================
// Check Role Middleware
// =========================
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Role không xác định, truy cập bị từ chối" });
    }

    if (allowedRoles.includes(req.user.role)) {
      next(); // đủ quyền
    } else {
      res.status(403).json({ message: "Bạn không có đủ quyền để thực hiện thao tác này" });
    }
  };
};
