// code frontend



import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  // ✅ Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users"); // đúng endpoint backend
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Thêm người dùng
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("⚠️ Tên không được để trống!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("⚠️ Email không hợp lệ!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", { name, email });
      setName("");
      setEmail("");
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi thêm người dùng:", err);
    }
  };

  // ✅ Xóa người dùng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("❌ Lỗi khi xóa:", err);
      }
    }
  };

  // ✅ Chỉnh sửa người dùng
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) {
      alert("Tên không được để trống!");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/users/${id}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>📋 Quản lý người dùng</h1>

      {/* Form thêm người dùng */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>

      <h2>Danh sách người dùng</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {editingUser === u._id ? (
              <>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
                <button onClick={() => handleUpdate(u._id)}>💾 Lưu</button>
                <button onClick={() => setEditingUser(null)}>❌ Hủy</button>
              </>
            ) : (
              <>
                {u.name} - {u.email}{" "}
                <button onClick={() => handleEdit(u)}>✏️ Sửa</button>
                <button onClick={() => handleDelete(u._id)}>🗑️ Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
