import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Có thể null nếu request không có authentication
  },
  action: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  statusCode: {
    type: Number,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: { expires: "30d" }, // TTL: Tự động xóa log sau 30 ngày
  },
}, { timestamps: true });

// Index để query nhanh
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);

