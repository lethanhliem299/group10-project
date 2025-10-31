import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosConfig";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      setProfile(res.data);
      setFormData({ name: res.data.name, email: res.data.email });
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Lỗi:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put("/auth/profile", formData);
      alert("✅ Cập nhật thông tin thành công!");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Có lỗi xảy ra!"));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("❌ Mật khẩu mới không khớp!");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `/password/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      );
      alert("✅ Đổi mật khẩu thành công!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Có lỗi xảy ra!"));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      alert("⚠️ Vui lòng chọn ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/users/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("✅ Tải ảnh đại diện thành công!");
      setProfile({ ...profile, avatar: res.data.avatar });
      setAvatarFile(null);
      setAvatarPreview(null);
      fetchProfile();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Tải ảnh thất bại!"));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa ảnh đại diện?")) return;

    console.log("🗑️ DELETE Avatar - Starting...");
    setLoading(true);
    try {
      console.log("🗑️ Calling DELETE /users/avatar");
      const response = await axiosInstance.delete(`/users/avatar`);
      console.log("✅ DELETE Response:", response.data);
      alert("✅ Đã xóa ảnh đại diện!");
      fetchProfile();
    } catch (err) {
      console.error("❌ DELETE Avatar Error:");
      console.error("- Status:", err.response?.status);
      console.error("- Message:", err.response?.data?.message);
      console.error("- Full error:", err);
      alert("❌ " + (err.response?.data?.message || "Có lỗi xảy ra!"));
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div>Đang tải...</div>;

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>👤 Hồ Sơ Cá Nhân</h1>
          <p>Quản lý thông tin cá nhân của bạn</p>
        </div>

        <div className="profile-grid">
          {/* Avatar Section */}
          <div className="card">
            <h2>📸 Ảnh Đại Diện</h2>
            <div className="avatar-section">
              <div className="avatar-display">
                <img
                  src={avatarPreview || profile.avatar || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className="avatar-img"
                />
              </div>
              <div className="avatar-actions">
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="avatar-input" className="btn btn-secondary">
                  📁 Chọn ảnh
                </label>
                {avatarFile && (
                  <button
                    onClick={handleAvatarUpload}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "⏳ Đang tải..." : "⬆️ Tải lên"}
                  </button>
                )}
                {profile.avatar && (
                  <button
                    onClick={handleAvatarDelete}
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    🗑️ Xóa
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="card">
            <div className="card-header">
              <h2>📝 Thông Tin Cá Nhân</h2>
              {!editMode && (
                <button onClick={() => setEditMode(true)} className="btn btn-secondary">
                  ✏️ Chỉnh sửa
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleUpdate} className="profile-form">
                <div className="form-field">
                  <label>Họ tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "⏳ Đang lưu..." : "💾 Lưu"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="btn btn-secondary"
                  >
                    ❌ Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <span className="label">Họ tên:</span>
                  <span className="value">{profile.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{profile.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Vai trò:</span>
                  <span className={`role-badge role-${profile.role}`}>
                    {profile.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 
                     profile.role === 'moderator' ? 'KIỂM DUYỆT VIÊN' : 'NGƯỜI DÙNG'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="card">
            <h2>🔒 Đổi Mật Khẩu</h2>
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-field">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "⏳ Đang xử lý..." : "🔄 Đổi mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
