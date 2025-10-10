import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList({ reload }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
      }
    };
    fetchUsers();
  }, [reload]);

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
