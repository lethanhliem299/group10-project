require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model'); // Đường dẫn đúng đến file user model

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");

    // Xóa tất cả user cũ trước khi tạo mới
    await User.deleteMany({});
    console.log("Deleted old users");

    // Dữ liệu user mẫu
    const users = [
      { name: 'User One', email: 'user@example.com', password: '123456', role: 'User' },
      { name: 'Mod One', email: 'mod@example.com', password: '123456', role: 'Moderator' },
      { name: 'Admin One', email: 'admin@example.com', password: '123456', role: 'Admin' },
    ];

    for (const u of users) {
      const user = new User(u);
      await user.save();
      console.log(`Seeded user: ${u.email}`);
    }

    mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

seed();
