import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // null nếu chưa đăng nhập (ví dụ: failed login)
  },
  action: {
    type: String,
    required: true,
    enum: [
      "LOGIN",
      "LOGOUT",
      "REGISTER",
      "PROFILE_UPDATE",
      "PASSWORD_CHANGE",
      "FORGOT_PASSWORD",
      "RESET_PASSWORD",
      "AVATAR_UPLOAD",
      "AVATAR_DELETE",
      "USER_CREATE",
      "USER_UPDATE",
      "USER_DELETE",
      "FAILED_LOGIN",
      "TOKEN_REFRESH"
    ]
  },
  email: { type: String }, // Email của user thực hiện action
  ip: { type: String },
  userAgent: { type: String },
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    default: "SUCCESS"
  },
  details: { type: String }, // Thông tin chi tiết
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 2592000 // TTL: tự động xóa sau 30 ngày (30 * 24 * 60 * 60)
  }
}, { timestamps: true });

// Index để truy vấn nhanh
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;

