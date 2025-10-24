import React, { useState } from "react";
import axios from "axios";

function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token"); // token lưu sau khi login

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Cập nhật thông tin thành công!");
    } catch (error) {
      setMessage("❌ Cập nhật thất bại, thử lại!");
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "0 auto" }}>
      <h2>Cập nhật thông tin cá nhân</h2>
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: 10 }}>
          <label>Họ và tên:</label><br />
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Số điện thoại:</label><br />
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Cập nhật
        </button>
      </form>

      {message && <p style={{ color: "green", marginTop: 10 }}>{message}</p>}
    </div>
  );
}

export default ProfileForm;
