// src/components/Auth/RegisterForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/signup", form);
      alert("Đăng ký thành công!");
    } catch (err) {
      alert("Email đã tồn tại hoặc lỗi hệ thống.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng ký tài khoản</h2>
      <input
        placeholder="Tên"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Đăng ký</button>
    </form>
  );
}
