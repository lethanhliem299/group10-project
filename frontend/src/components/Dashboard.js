import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

function Dashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  // Test gọi API với accessToken
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      console.log("✅ Profile loaded:", res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải profile:", err);
      if (err.response?.status === 401) {
        alert("Token đã hết hạn! Đang thử refresh token...");
        // Sẽ tự động refresh thông qua interceptor
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      console.log("✅ Logout thành công");
      onLogout();
    } catch (err) {
      console.error("❌ Lỗi khi logout:", err);
      // Vẫn logout dù có lỗi
      localStorage.clear();
      onLogout();
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Đăng xuất khỏi TẤT CẢ thiết bị?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${API_URL}/auth/logout-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.clear();
      alert("✅ Đã đăng xuất khỏi tất cả thiết bị!");
      onLogout();
    } catch (err) {
      console.error("❌ Lỗi:", err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🎉 Chào mừng, {profile?.name}!</h1>
        <p className="subtitle">Bạn đã đăng nhập thành công với hệ thống Refresh Token</p>
      </div>

      <div className="dashboard-content">
        <div className="info-card">
          <h2>👤 Thông Tin Tài Khoản</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">📧 Email:</span>
              <span className="info-value">{profile?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">👥 Vai trò:</span>
              <span className={`role-badge role-${profile?.role}`}>
                {profile?.role?.toUpperCase()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">🆔 User ID:</span>
              <span className="info-value">{profile?._id || profile?.id}</span>
            </div>
          </div>
        </div>

        <div className="token-info-card">
          <h2>🔐 Thông Tin Token</h2>
          <div className="token-details">
            <div className="token-item">
              <span className="token-label">Access Token:</span>
              <code className="token-value">
                {localStorage.getItem("accessToken")?.substring(0, 50)}...
              </code>
            </div>
            <div className="token-item">
              <span className="token-label">Refresh Token:</span>
              <code className="token-value">
                {localStorage.getItem("refreshToken")?.substring(0, 50)}...
              </code>
            </div>
          </div>
          <p className="token-note">
            💡 <strong>Access Token</strong> hết hạn sau 15 phút.<br/>
            💡 <strong>Refresh Token</strong> hết hạn sau 7 ngày.<br/>
            💡 Hệ thống sẽ <strong>tự động làm mới</strong> Access Token khi hết hạn.
          </p>
        </div>

        <div className="actions-card">
          <h2>⚙️ Thao Tác</h2>
          <div className="action-buttons">
            <button 
              onClick={fetchProfile} 
              className="btn btn-reload"
              disabled={loading}
            >
              {loading ? "⏳ Đang tải..." : "🔄 Reload Profile"}
            </button>
            <button onClick={handleLogout} className="btn btn-logout">
              🚪 Đăng Xuất
            </button>
            <button onClick={handleLogoutAll} className="btn btn-logout-all">
              🚫 Đăng Xuất Tất Cả Thiết Bị
            </button>
          </div>
        </div>

        <div className="test-card">
          <h2>🧪 Hướng Dẫn Test Refresh Token</h2>
          <ol className="test-steps">
            <li>Mở <strong>DevTools</strong> (F12) → Tab <strong>Console</strong></li>
            <li>Nhấn nút <strong>"🔄 Reload Profile"</strong> → Xem request thành công</li>
            <li>Đợi <strong>15 phút</strong> (hoặc giảm thời gian expire trong code)</li>
            <li>Nhấn lại <strong>"🔄 Reload Profile"</strong></li>
            <li>Hệ thống sẽ <strong>tự động gọi</strong> <code>/auth/refresh</code></li>
            <li>Access Token mới được lưu vào localStorage</li>
            <li>Request profile sẽ <strong>thành công</strong> với token mới!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

