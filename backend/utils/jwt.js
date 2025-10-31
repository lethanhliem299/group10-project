import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

// Thời gian hết hạn
const ACCESS_TOKEN_EXPIRES = "15m";  // Access token hết hạn sau 15 phút
const REFRESH_TOKEN_EXPIRES_DAYS = 7; // Refresh token hết hạn sau 7 ngày

/**
 * Tạo Access Token (JWT)
 */
export const generateAccessToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
};

/**
 * Tạo Refresh Token và lưu vào DB
 */
export const generateRefreshToken = async (userId, deviceInfo = {}) => {
  // Tạo random token
  const token = crypto.randomBytes(64).toString("hex");

  // Tính ngày hết hạn
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  // Lưu vào database
  await RefreshToken.create({
    userId,
    token,
    deviceInfo,
    expiresAt
  });

  return token;
};

/**
 * Xác thực Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw err; // Throw lỗi để middleware xử lý
  }
};

/**
 * Xác thực Refresh Token
 */
export const verifyRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });

  if (!refreshToken) {
    throw new Error("Refresh token không hợp lệ");
  }

  if (new Date() > refreshToken.expiresAt) {
    await RefreshToken.deleteOne({ token });
    throw new Error("Refresh token đã hết hạn");
  }

  return refreshToken;
};

/**
 * Thu hồi Refresh Token (Logout)
 */
export const revokeRefreshToken = async (token) => {
  const result = await RefreshToken.deleteOne({ token });
  return result.deletedCount > 0;
};

/**
 * Thu hồi tất cả Refresh Token của user (Logout All Devices)
 */
export const revokeAllUserTokens = async (userId) => {
  const result = await RefreshToken.deleteMany({ userId });
  return result.deletedCount;
};

