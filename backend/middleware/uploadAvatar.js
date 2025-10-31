import multer from "multer";
import sharp from "sharp";
import path from "path";

// Cấu hình Multer để lưu file vào memory (không lưu disk)
const storage = multer.memoryStorage();

// File filter: chỉ chấp nhận ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)"));
  }
};

// Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// Middleware xử lý resize ảnh với Sharp
export const processAvatar = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Resize ảnh về 500x500px, convert sang PNG
    const processedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover" })
      .png({ quality: 90 })
      .toBuffer();

    // Lưu buffer đã xử lý vào req
    req.file.buffer = processedBuffer;
    req.file.mimetype = "image/png";
    req.file.originalname = req.file.originalname.replace(/\.\w+$/, ".png");

    next();
  } catch (err) {
    return res.status(400).json({ message: "Lỗi xử lý ảnh", error: err.message });
  }
};

export default upload;

