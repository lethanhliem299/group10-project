import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css";

const API_URL = "http://localhost:5000";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    console.log("🔐 Forgot Password - Frontend");
    console.log("- Email:", email);
    console.log("- API URL:", `${API_URL}/password/forgot-password`);

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Sending request to backend...");
      const res = await axios.post(`${API_URL}/password/forgot-password`, { email });
      console.log("✅ Response:", res.data);
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      console.error("❌ Error:", err);
      console.error("- Response:", err.response?.data);
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2>Quên Mật Khẩu</h2>
          <p>Nhập email để nhận link đặt lại mật khẩu</p>
          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Email của bạn</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vd: elon@tesla.com"
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "⏳ Đang gửi..." : "Gửi Link Đặt Lại"}
          </button>
        </form>

        <div className="auth-toggle">
          <Link to="/">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

