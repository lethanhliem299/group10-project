import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUser from "./AddUser";

function UserList() {
  const [users, setUsers] = useState([]);

  // Gọi API GET để lấy danh sách user
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <AddUser fetchUsers={fetchUsers} />
      <h2>Danh sách người dùng</h2>
      <ul>
        {users.length > 0 ? (
          users.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email}
            </li>
          ))
        ) : (
          <li>Chưa có người dùng</li>
        )}
      </ul>
    </div>
  );
}

export default UserList;
