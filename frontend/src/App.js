import React from "react";
import UserList from "./components/UserList";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Quản lý người dùng 👤</h1>
      <UserList />
    </div>
  );
}

export default App;
