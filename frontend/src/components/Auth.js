import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const API_URL = "http://localhost:5000";

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });

        // Lưu tokens vào localStorage
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("✅ Login thành công:", res.data);
        onLoginSuccess(res.data.user);
      } else {
        // REGISTER
        await axios.post(`${API_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        alert("✅ Đăng ký thành công! Hãy đăng nhập.");
        setIsLogin(true);
        setFormData({ ...formData, name: "", password: "" });
      }
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Good to see you again" : "Create your account"}</h2>
          <p>
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Sign up to get started with our platform."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-field">
              <label>Your name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-field">
            <label>Your email</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. elon@tesla.com"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Your password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isLogin ? "e.g. ilovemangools123" : "Enter your password"}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-field">
              <label>Your role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          )}

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "⏳ Processing..." : isLogin ? "Sign in" : "Sign up"}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Auth;
