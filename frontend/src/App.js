import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

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
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  if (isLoggedIn) {
    return <Home username={username} onLogout={handleLogout} />;
  }

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  return <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />;
}

export default App;