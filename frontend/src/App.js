import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CalendarPage from "./pages/Calendar";
import Settings from "./pages/Settings";
import Todo from "./pages/Todo"; // ✅ 追加
import Sidebar from "./components/Sidebar";
import "./styles/Sidebar.css";

function App() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (user, adminFlag) => {
    setUsername(user);
    setIsAdmin(adminFlag);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername("");
    setIsAdmin(false);
    setIsLoggedIn(false);
  };

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />;
  }

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "220px", padding: "20px", flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home username={username} onLogout={handleLogout} />} />
            <Route path="/calendar" element={<CalendarPage username={username} />} />
            <Route path="/settings" element={<Settings onLogout={handleLogout} isAdmin={isAdmin} />} />
            <Route path="/todo" element={<Todo username={username} />} /> {/* ✅ ToDo専用ページ */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
