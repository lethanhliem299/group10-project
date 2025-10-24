import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", formData);
      setMessage(res.data.message || "Đăng ký thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi đăng ký!");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Tên" onChange={handleChange} /><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} /><br />
        <button type="submit">Đăng ký</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;
