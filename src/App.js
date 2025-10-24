import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import Admin from "./Admin"; // ✅ thêm dòng này

function App() {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1>Hệ thống Authentication</h1>
        <nav>
          <Link to="/register" style={{ marginRight: 10 }}>Đăng ký</Link>
          <Link to="/login" style={{ marginRight: 10 }}>Đăng nhập</Link>
          <Link to="/profile" style={{ marginRight: 10 }}>Cập nhật thông tin</Link>
          <Link to="/admin">Trang Admin</Link> {/* ✅ thêm nút Trang Admin */}
        </nav>

        <hr />

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} /> {/* ✅ route admin */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
