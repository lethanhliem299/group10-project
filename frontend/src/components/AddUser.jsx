import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", { name, email });
      setName("");
      setEmail("");
      onUserAdded();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
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
  );
}

export default AddUser;
