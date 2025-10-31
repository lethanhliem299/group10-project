import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import crypto from "crypto";

// Tạo Access Token
const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Tạo Refresh Token & lưu vào DB
const generateRefreshToken = async (userId, deviceInfo) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày

  await RefreshToken.create({
    userId,
    token,
    deviceInfo,
    expiresAt,
  });

  return token;
};

// Verify Access Token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

// Verify Refresh Token
const verifyRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });
  if (!refreshToken) {
    throw new Error("Invalid refresh token");
  }
  if (refreshToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token });
    throw new Error("Refresh token expired");
  }
  return refreshToken;
};

// Revoke Refresh Token
const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

// Revoke all tokens của 1 user
const revokeAllUserTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
};
