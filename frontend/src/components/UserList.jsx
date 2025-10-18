import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ reload, onUserChanged }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
      }
    };
    fetchUsers();
  }, [reload]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await axios.delete(`http://localhost:5000/users/${id}`);
        onUserChanged();
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

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
      onUserChanged();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <div>
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
                <button onClick={() => handleUpdate(u._id)}>Lưu</button>
                <button onClick={() => setEditingUser(null)}>Hủy</button>
              </>
            ) : (
              <>
                {u.name} - {u.email}{" "}
                <button onClick={() => handleEdit(u)}>Sửa</button>
                <button onClick={() => handleDelete(u._id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
