import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { selectUser, logout as logoutAction } from "../redux/authSlice";
import "./Navbar.css";

const API_URL = "http://localhost:5000";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      console.log("✅ Logout từ server thành công");
    } catch (err) {
      console.error("⚠️ Lỗi logout từ server:", err);
    } finally {
      // Luôn luôn dispatch logout action để clear Redux state
      dispatch(logoutAction());
      console.log("✅ Redux: Đã xóa state và logout");
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          🎉 Hệ Thống Quản Lý Người Dùng
        </div>

        <div className="nav-links">
          <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            🏠 Trang chủ
          </Link>
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            👤 Hồ sơ
          </Link>
          {user?.role === "admin" && (
            <>
              <Link to="/users" className={isActive("/users") ? "active" : ""}>
                👥 Người dùng
              </Link>
              <Link to="/logs" className={isActive("/logs") ? "active" : ""}>
                📊 Nhật ký
              </Link>
            </>
          )}
        </div>

        <div className="nav-user">
          <span className="nav-username">👋 {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout-nav">
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
