import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosConfig";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      alert("❌ " + (err.response?.data?.message || "Không thể tải danh sách người dùng!"));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/admin/users/${id}`, formData);
      alert("✅ Cập nhật thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Cập nhật thất bại!"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      alert("✅ Đã xóa người dùng!");
      fetchUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Xóa thất bại!"));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setLoading(true);
    try {
      await axiosInstance.patch(
        `/admin/users/${id}/toggle-active`,
        { isActive: !currentStatus }
      );
      alert(`✅ Đã ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"} người dùng!`);
      fetchUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Có lỗi xảy ra!"));
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role) => {
    if (role === 'admin') return 'QUẢN TRỊ VIÊN';
    if (role === 'moderator') return 'KIỂM DUYỆT VIÊN';
    return 'NGƯỜI DÙNG';
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>👥 Quản Lý Người Dùng</h1>
          <p>Quản lý tất cả người dùng trong hệ thống (Chỉ Quản Trị Viên)</p>
        </div>

        {loading && <p>⏳ Đang tải...</p>}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Mã ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id?.substring(0, 8)}...</td>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="table-input"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="table-input"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editingUser === user._id ? (
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="table-select"
                      >
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="moderator">Kiểm duyệt viên</option>
                      </select>
                    ) : (
                      <span className={`role-badge role-${user.role}`}>
                        {getRoleName(user.role)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                      {user.isActive ? "✅ Hoạt động" : "❌ Tắt"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <div className="action-buttons">
                      {editingUser === user._id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(user._id)}
                            className="btn btn-save"
                            disabled={loading}
                          >
                            💾
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="btn btn-cancel"
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="btn btn-edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleToggleActive(user._id, user.isActive)}
                            className="btn btn-toggle"
                            disabled={loading}
                          >
                            {user.isActive ? "🚫" : "✅"}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-delete"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !loading && (
            <div className="empty-state">
              <p>Không có người dùng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
