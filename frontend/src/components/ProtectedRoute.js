import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../redux/authSlice";

function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  console.log("🛡️ ProtectedRoute Check:");
  console.log("- isAuthenticated:", isAuthenticated);
  console.log("- user:", user);
  console.log("- requiredRole:", requiredRole);

  // Kiểm tra đã đăng nhập chưa (từ Redux Store)
  if (!isAuthenticated || !user) {
    console.log("❌ Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole) {
    if (user.role !== requiredRole) {
      console.log("❌ Insufficient permissions:", user.role, "!==", requiredRole);
      alert("⛔ Bạn không có quyền truy cập trang này!");
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("✅ Access granted");
  return children;
}

export default ProtectedRoute;

