// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Kết nối MongoDB
mongoose
  .connect("mongodb://localhost:27017/group10", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🧩 Schema và Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// 🧠 API ROUTES
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  await newUser.save();
  res.json(newUser);
});

// 🚀 Khởi động server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
