import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  // Verify token khi component mount
  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      await axios.get(`${API_URL}/password/verify-reset-token/${token}`);
      setTokenValid(true);
    } catch (err) {
      setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/password/reset-password/${token}`, {
        newPassword
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">⏳</div>
            <h2>Đang xác thực...</h2>
            <p>Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">❌</div>
            <h2>Link Không Hợp Lệ</h2>
            <p>{error}</p>
          </div>
          <div className="auth-toggle">
            <Link to="/forgot-password">Gửi lại link đặt lại mật khẩu</Link>
            <br />
            <Link to="/" style={{ marginTop: "10px", display: "block" }}>← Quay lại đăng nhập</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2>Đặt Lại Mật Khẩu</h2>
          <p>Nhập mật khẩu mới của bạn</p>
          {message && (
            <div className="success-message">
              ✅ {message}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Mật khẩu mới</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Xác nhận mật khẩu</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đặt Lại Mật Khẩu"}
          </button>
        </form>

        <div className="auth-toggle">
          <Link to="/">← Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

