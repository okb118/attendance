// App.js
import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Admin from "./Admin";

function App() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (user, adminFlag) => {
    setUsername(user);
    setIsAdmin(adminFlag);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername("");
    setIsAdmin(false);
    setIsLoggedIn(false);
  };

  const handleRegister = () => setShowRegister(true);
  const handleBackToLogin = () => setShowRegister(false);

  return (
    <div>
      {isLoggedIn ? (
        isAdmin ? (
          <Admin admin={username} onLogout={handleLogout} />
        ) : (
          <Home username={username} onLogout={handleLogout} />
        )
      ) : showRegister ? (
        <Register onBack={handleBackToLogin} />
      ) : (
        <Login onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}

export default App;
