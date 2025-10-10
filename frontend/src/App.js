import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);

  const handleUserAdded = () => {
    setReload(!reload); // reload lại danh sách sau khi thêm/sửa/xóa
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList reload={reload} onUserChanged={handleUserAdded} />
    </div>
  );
}

export default App;
