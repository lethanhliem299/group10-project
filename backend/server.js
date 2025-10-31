import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Import routes đúng với vị trí server.js
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profileRoutes.js"; // nếu bạn có route profile
import authRoutes from "./routes/authRoutes.js"; // nếu có route auth
import logRoutes from "./routes/logRoutes.js";

// Import middleware
import logRequest from "./middleware/logActivity.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

const app = express();

// -------------------
// Middleware
// -------------------
app.use(cors());
app.use(express.json());

// Global rate limiter - áp dụng cho tất cả routes
app.use(apiRateLimiter);

// Activity logging - log tất cả requests
app.use(logRequest);

// -------------------
// MongoDB connection
// -------------------
mongoose.connect("mongodb://localhost:27017/group10")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -------------------
// Routes
// -------------------
app.use("/users", userRoutes);
app.use("/auth", authRoutes);       // route auth (register, login)
app.use("/profile", profileRoutes); // route profile (get/update profile)
app.use("/api/logs", logRoutes);    // Activity logs (admin + user)

// -------------------
// Root endpoint
// -------------------
app.get("/", (req, res) => {
  res.send("✅ Backend RBAC server running on localhost:5000");
});

// -------------------
// Start server
// -------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
