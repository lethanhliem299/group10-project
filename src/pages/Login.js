import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      const jwtToken = res.data.token;
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
      alert("Đăng nhập thành công!");
    } catch (err) {
      alert(err.response?.data?.message || "Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Đăng nhập</button>
      </form>

      {token && (
        <div>
          <h4>JWT Token:</h4>
          <textarea readOnly value={token} rows="4" cols="40" />
        </div>
      )}
    </div>
  );
};

export default Login;
