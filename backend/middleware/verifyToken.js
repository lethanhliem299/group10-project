import { verifyAccessToken } from "../utils/jwt.js";

const verifyToken = (req, res, next) => {
  console.log("🔐 verifyToken middleware:");
  console.log("- Method:", req.method);
  console.log("- Path:", req.path);
  console.log("- Authorization header:", req.headers.authorization ? "✅ Present" : "❌ Missing");
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No auth header");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    console.log("❌ No token in header");
    return res.status(401).json({ message: "Token not found" });
  }

  console.log("🔑 Token:", token.substring(0, 20) + "...");

  try {
    const decoded = verifyAccessToken(token);
    console.log("✅ Token valid, user:", decoded.id);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.log("❌ Token verification failed:");
    console.log("- Error name:", err.name);
    console.log("- Error message:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default verifyToken;

