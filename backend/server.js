import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../pro.env" });

// ✅ Import routes
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import moderatorRoutes from "./routes/moderatorRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";

const app = express();

// Import middleware
import { logActivity } from "./middleware/logActivity.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// -------------------
// Middleware
// -------------------
app.use(cors());
app.use(express.json());

// Activity logging (log mọi request)
app.use(logActivity);

// General API rate limiting
app.use(apiLimiter);

// -------------------
// MongoDB connection
// -------------------
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/group10";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected to:", MONGODB_URI))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// -------------------
// Routes
// -------------------
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/password", passwordRoutes);
app.use("/admin", adminRoutes);         // Admin routes (RBAC)
app.use("/moderator", moderatorRoutes); // Moderator routes (RBAC)
app.use("/logs", logRoutes);            // Activity logs (Admin only)

// -------------------
// Root endpoint
// -------------------
app.get("/", (req, res) => {
  res.send("✅ Backend RBAC server running on localhost:5000");
});

// -------------------
// Start server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
