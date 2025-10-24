const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "backend_uploads", // folder lưu trên Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const upload = multer({ storage: storage });

// Route upload file
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({
      message: "Upload thành công!",
      url: req.file.path, // đường dẫn file trên Cloudinary
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload thất bại", error });
  }
});

module.exports = router;
