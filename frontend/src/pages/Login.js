import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginStart, loginSuccess, loginFailure, selectAuth } from "../redux/authSlice";
import "./Auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: reduxError } = useSelector(selectAuth);
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(loginStart());

    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);

      // Dispatch Redux action
      dispatch(loginSuccess({
        user: res.data.user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      }));

      console.log("✅ Redux: Đăng nhập thành công:", res.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Lỗi:", err);
      const errorMessage = err.response?.data?.message || "Email hoặc mật khẩu không đúng!";
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Chào mừng trở lại</h2>
          <p>Vui lòng đăng nhập vào tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label>Email của bạn</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vd: elon@tesla.com"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Mật khẩu</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="vd: matkhau123"
                required
              />
            </div>
            <div style={{ textAlign: "right", marginTop: "5px" }}>
              <Link to="/forgot-password" style={{ fontSize: "14px", color: "#2c5f2d" }}>
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          {(error || reduxError) && <div className="error-message">❌ {error || reduxError}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="auth-toggle">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
