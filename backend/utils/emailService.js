import nodemailer from "nodemailer";

/**
 * Gửi email reset password
 */
export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    console.log("📧 Email Service Configuration:");
    console.log("- Host:", process.env.EMAIL_HOST);
    console.log("- Port:", process.env.EMAIL_PORT);
    console.log("- User:", process.env.EMAIL_USER);
    console.log("- Password:", process.env.EMAIL_PASSWORD ? "✅ Set" : "❌ Missing");
    console.log("- Sending to:", email);
    console.log("- Reset token:", resetToken.substring(0, 10) + "...");
    
    // Tạo transporter (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Verify connection
    console.log("🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified!");

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Nội dung email
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM || 'User Management System'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Đặt lại mật khẩu - User Management System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2c5f2d;">🔐 Yêu cầu đặt lại mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2c5f2d; 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Hoặc copy link sau vào trình duyệt:<br>
            <a href="${resetUrl}" style="color: #2c5f2d;">${resetUrl}</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            ⚠️ Link này sẽ hết hạn sau <strong>1 giờ</strong>.<br>
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>
      `
    };

    // Gửi email
    console.log("📤 Sending email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("- Message ID:", info.messageId);
    console.log("- Response:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error("- Error name:", error.name);
    console.error("- Error message:", error.message);
    console.error("- Error code:", error.code);
    console.error("- Full error:", error);
    throw new Error("Không thể gửi email: " + error.message);
  }
};

