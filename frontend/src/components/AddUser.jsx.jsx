import React, { useState } from "react";
import axios from "axios";

function AddUser({ fetchUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Gọi API POST để thêm user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = { name, email };

    try {
      await axios.post("http://localhost:3000/users", newUser);
      alert("Thêm người dùng thành công!");
      setName("");
      setEmail("");
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi thêm user:", error);
      alert("Thêm người dùng thất bại!");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
