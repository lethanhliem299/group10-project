import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";

// Config Cloudinary (chỉ chạy một lần)
let isCloudinaryConfigured = false;
const configureCloudinary = () => {
  if (!isCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    console.log("🔧 Cloudinary Config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing"
    });
    
    isCloudinaryConfigured = true;
  }
};

// ============================
// Upload Avatar
// ============================
export const uploadAvatar = async (req, res) => {
  try {
    // Config Cloudinary lần đầu tiên gọi API
    configureCloudinary();
    
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Xóa avatar cũ trên Cloudinary (nếu có)
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.error("Lỗi khi xóa avatar cũ:", err);
      }
    }

    // Resize và optimize ảnh bằng Sharp
    const optimizedImageBuffer = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: "cover",
        position: "center"
      })
      .png({ quality: 90 })
      .toBuffer();

    // Upload lên Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: `user_${user._id}_${Date.now()}`,
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(optimizedImageBuffer);
    });

    const result = await uploadPromise;

    // Cập nhật avatar trong database
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({
      message: "Upload avatar thành công",
      avatar: user.avatar,
      avatarPublicId: user.avatarPublicId
    });
  } catch (err) {
    console.error("❌ Lỗi upload avatar:", err);
    res.status(500).json({ 
      message: "Lỗi khi upload avatar", 
      error: err.message 
    });
  }
};

// ============================
// Delete Avatar
// ============================
export const deleteAvatar = async (req, res) => {
  try {
    console.log("🗑️ DELETE Avatar Request:");
    console.log("- User ID:", req.user?.id);
    console.log("- Headers:", req.headers.authorization ? "✅ Token present" : "❌ No token");
    
    // Config Cloudinary lần đầu tiên gọi API
    configureCloudinary();
    
    const user = await User.findById(req.user.id);
    console.log("- User found:", user ? `✅ ${user.email}` : "❌ Not found");
    console.log("- Current avatar:", user?.avatar || "None");
    console.log("- Avatar public ID:", user?.avatarPublicId || "None");
    
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (!user.avatarPublicId) {
      console.log("⚠️ No avatar public ID to delete");
      return res.status(400).json({ message: "Không có avatar để xóa" });
    }

    // Xóa ảnh trên Cloudinary
    try {
      console.log("☁️ Deleting from Cloudinary:", user.avatarPublicId);
      const result = await cloudinary.uploader.destroy(user.avatarPublicId);
      console.log("☁️ Cloudinary delete result:", result);
    } catch (err) {
      console.error("⚠️ Lỗi khi xóa avatar trên Cloudinary:", err.message);
    }

    // Xóa avatar trong database
    user.avatar = "";
    user.avatarPublicId = "";
    await user.save();
    
    console.log("✅ Avatar deleted successfully from database");

    res.json({ message: "Đã xóa avatar" });
  } catch (err) {
    console.error("❌ Lỗi xóa avatar:");
    console.error("- Error name:", err.name);
    console.error("- Error message:", err.message);
    console.error("- Stack:", err.stack);
    res.status(500).json({ 
      message: "Lỗi khi xóa avatar", 
      error: err.message 
    });
  }
};

