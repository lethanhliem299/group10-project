import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);

  const handleUserAdded = () => {
    setReload(!reload);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList reload={reload} />
    </div>
  );
}

export default App;
