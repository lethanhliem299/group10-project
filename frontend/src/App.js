import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./components/Auth/RegisterForm";
import LoginForm from "./components/Auth/LoginForm";
import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "10px", backgroundColor: "#f8f8f8" }}>
        <Link to="/login" style={{ marginRight: "10px" }}>
          Đăng nhập
        </Link>
        <Link to="/signup" style={{ marginRight: "10px" }}>
          Đăng ký
        </Link>
        <Link to="/profile">Hồ sơ</Link>
      </div>

      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
