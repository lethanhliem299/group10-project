// src/components/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:3001/api/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật thành công!");
    } catch {
      alert("Lỗi cập nhật!");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thông tin cá nhân</h2>
      <input
        value={user.name || ""}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Tên"
      />
      <button onClick={handleUpdate}>Cập nhật</button>
    </div>
  );
}
