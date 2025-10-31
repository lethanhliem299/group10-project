import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosConfig";
import "./ActivityLogs.css";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    action: "",
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchLogs();
  }, [filters.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.action) params.append("action", filters.action);
      params.append("page", filters.page);
      params.append("limit", filters.limit);

      const res = await axiosInstance.get(`/logs?${params.toString()}`);
      setLogs(res.data.logs || res.data);
    } catch (err) {
      console.error("❌ Lỗi:", err);
      alert("❌ " + (err.response?.data?.message || "Không thể tải nhật ký!"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchLogs();
  };

  const getActionColor = (action) => {
    if (action?.includes("login")) return "action-login";
    if (action?.includes("logout")) return "action-logout";
    if (action?.includes("register")) return "action-register";
    if (action?.includes("update")) return "action-update";
    if (action?.includes("delete")) return "action-delete";
    return "action-default";
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>📊 Nhật Ký Hoạt Động</h1>
          <p>Xem lịch sử hoạt động của người dùng (Chỉ Quản Trị Viên)</p>
        </div>

        <div className="logs-container">
          <div className="logs-filters">
            <form onSubmit={handleSearch} className="filter-form">
              <div className="filter-group">
                <label>Mã người dùng</label>
                <input
                  type="text"
                  placeholder="Nhập mã người dùng..."
                  value={filters.userId}
                  onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                />
              </div>
              <div className="filter-group">
                <label>Hành động</label>
                <input
                  type="text"
                  placeholder="Nhập hành động..."
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-search" disabled={loading}>
                🔍 Tìm kiếm
              </button>
            </form>
          </div>

          {loading && <p>⏳ Đang tải...</p>}

          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Mã người dùng</th>
                  <th>Hành động</th>
                  <th>Địa chỉ IP</th>
                  <th>Trình duyệt</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={log._id || idx}>
                    <td className="log-time">
                      {new Date(log.timestamp || log.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="log-user">
                      {log.userId?.substring(0, 10) || "N/A"}...
                    </td>
                    <td>
                      <span className={`action-badge ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="log-ip">{log.ip || "N/A"}</td>
                    <td className="log-ua">{log.userAgent?.substring(0, 50) || "N/A"}...</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {logs.length === 0 && !loading && (
              <div className="empty-state">
                <p>Không có nhật ký nào</p>
              </div>
            )}
          </div>

          <div className="pagination">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
              disabled={filters.page === 1 || loading}
              className="btn btn-page"
            >
              ← Trước
            </button>
            <span className="page-info">Trang {filters.page}</span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={logs.length < filters.limit || loading}
              className="btn btn-page"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogs;
