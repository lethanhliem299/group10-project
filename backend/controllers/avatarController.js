import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh để upload" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    // Xóa ảnh cũ trên Cloudinary (nếu có)
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    // Upload ảnh mới lên Cloudinary từ buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: `avatar_${user._id}_${Date.now()}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert buffer thành stream
      const bufferStream = Readable.from(req.file.buffer);
      bufferStream.pipe(stream);
    });

    // Cập nhật avatar URL và public_id vào User
    user.avatar = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
    await user.save();

    res.json({
      message: "Upload avatar thành công",
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Delete avatar
export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    if (!user.avatarPublicId) {
      return res.status(400).json({ message: "User chưa có avatar" });
    }

    // Xóa ảnh trên Cloudinary
    await cloudinary.uploader.destroy(user.avatarPublicId);

    // Xóa avatar trong DB
    user.avatar = "";
    user.avatarPublicId = "";
    await user.save();

    res.json({ message: "Xóa avatar thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

