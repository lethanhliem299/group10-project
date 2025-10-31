import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    token: { 
      type: String, 
      required: true, 
      unique: true 
    },
    deviceInfo: {
      userAgent: { type: String },
      ip: { type: String }
    },
    expiresAt: { 
      type: Date, 
      required: true, 
      index: { expires: "0s" } // TTL index - tự động xóa khi hết hạn
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  { timestamps: true }
);

export default mongoose.model("RefreshToken", refreshTokenSchema);

