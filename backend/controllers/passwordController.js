import User from "../models/User.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/emailService.js";

/**
 * Forgot Password - Gửi email reset password
 */
export const forgotPassword = async (req, res) => {
  try {
    console.log("\n🔐 Forgot Password Request:");
    console.log("- Email requested:", req.body.email);
    
    const { email } = req.body;

    if (!email) {
      console.log("❌ No email provided");
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    // Tìm user
    console.log("🔍 Searching for user in database...");
    const user = await User.findOne({ email });
    console.log("- User found:", user ? `✅ ${user.email}` : "❌ Not found");
    
    if (!user) {
      // Không tiết lộ email có tồn tại hay không (bảo mật)
      console.log("⚠️ User not found, but returning success message for security");
      return res.json({ message: "Nếu email tồn tại, link reset password đã được gửi" });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash token trước khi lưu vào DB
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Lưu token vào user (expires sau 1 giờ)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Gửi email
    try {
      await sendResetPasswordEmail(email, resetToken);
      console.log(`✅ Reset password email sent to: ${email}`);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // Xóa token nếu gửi email thất bại
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ 
        message: "Không thể gửi email. Vui lòng thử lại sau." 
      });
    }

    res.json({ message: "Email reset password đã được gửi. Vui lòng kiểm tra hộp thư." });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * Verify Reset Token - Kiểm tra token có hợp lệ không
 */
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token từ URL
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    res.json({ message: "Token hợp lệ", email: user.email });
  } catch (err) {
    console.error("❌ Verify token error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * Reset Password - Đặt lại mật khẩu mới
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Hash token từ URL
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Tìm user với token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Đặt mật khẩu mới (sẽ tự động hash bởi pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✅ Password reset successful for: ${user.email}`);

    res.json({ message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay." });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

/**
 * Change Password - Đổi mật khẩu (khi đã đăng nhập)
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // Tìm user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Đặt mật khẩu mới
    user.password = newPassword;
    await user.save();

    console.log(`✅ Password changed for: ${user.email}`);

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Change password error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

