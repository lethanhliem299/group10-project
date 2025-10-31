import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosConfig";
import { selectAuth, updateUser } from "../redux/authSlice";
import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const { user, accessToken, refreshToken } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/auth/profile");
      dispatch(updateUser(res.data));
      console.log("✅ Redux: Đã cập nhật profile:", res.data);
    } catch (err) {
      console.error("❌ Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>🎉 Chào mừng, {user.name}!</h1>
          <p>Bạn đã đăng nhập thành công - State quản lý bằng <strong>Redux Toolkit</strong></p>
        </div>

        <div className="dashboard-grid">
          <div className="info-card">
            <h2>👤 Thông Tin Tài Khoản (từ Redux Store)</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">📧 Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">👥 Vai trò:</span>
                <span className={`role-badge role-${user.role}`}>
                  {user.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 
                   user.role === 'moderator' ? 'KIỂM DUYỆT VIÊN' : 'NGƯỜI DÙNG'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">🆔 Mã người dùng:</span>
                <span className="info-value">{user._id || user.id}</span>
              </div>
            </div>
          </div>

          <div className="token-info-card">
            <h2>🔐 Thông Tin Token (từ Redux Store)</h2>
            <div className="token-details">
              <div className="token-item">
                <span className="token-label">Access Token:</span>
                <code className="token-value">
                  {accessToken?.substring(0, 50)}...
                </code>
              </div>
              <div className="token-item">
                <span className="token-label">Refresh Token:</span>
                <code className="token-value">
                  {refreshToken?.substring(0, 50)}...
                </code>
              </div>
            </div>
            <p className="token-note">
              💡 <strong>Access Token</strong> hết hạn sau 15 phút.<br/>
              💡 <strong>Refresh Token</strong> hết hạn sau 7 ngày.<br/>
              💡 Hệ thống sẽ <strong>tự động làm mới</strong> Access Token khi hết hạn.<br/>
              🔥 <strong>State được quản lý bởi Redux Toolkit!</strong>
            </p>
          </div>

          <div className="actions-card">
            <h2>⚙️ Thao Tác Nhanh</h2>
            <div className="action-buttons">
              <button 
                onClick={fetchProfile} 
                className="btn btn-reload"
                disabled={loading}
              >
                {loading ? "⏳ Đang tải..." : "🔄 Tải Lại Hồ Sơ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
