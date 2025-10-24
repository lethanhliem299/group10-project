import React, { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);

  // Gọi API để lấy danh sách user
  useEffect(() => {
    fetch("http://localhost:5000/api/users") // đổi port nếu backend khác
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Lỗi tải users:", err));
  }, []);

  // Hàm xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa user này không?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u._id !== id)); // xóa khỏi danh sách hiển thị
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách Users</h2>
      {users.length === 0 ? (
        <p>Không có user nào.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id} style={{ marginBottom: 8 }}>
              <b>{user.name}</b> — {user.email} — {user.role?.toUpperCase() || "USER"}{" "}
              <button onClick={() => handleDelete(user._id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
