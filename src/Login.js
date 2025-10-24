import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      const jwtToken = res.data.token;
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
      setMessage("Đăng nhập thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  return (
    <div>
      <h3>Đăng nhập</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Đăng nhập</button>
      </form>

      {message && <p>{message}</p>}
      {token && (
        <div>
          <h4>JWT Token:</h4>
          <textarea value={token} readOnly rows="4" cols="60" />
        </div>
      )}
    </div>
  );
}

export default Login;
