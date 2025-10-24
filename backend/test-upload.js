const cloudinary = require("./config/cloudinary.config");

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload("path/to/your/image.jpg");
    console.log("Upload thành công:", result.url);
  } catch (err) {
    console.error("Upload lỗi:", err);
  }
}

testUpload();
