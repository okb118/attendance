import { useState } from "react";
import "../styles/Login.css";


function Login({ onLogin, onRegister, onGuest }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      onLogin(data.user, data.is_admin === 1);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      <div className="login-box">
        <div className="login-left">
          <h3>会員登録がお済みのお客様</h3>
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="checkbox">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor="showPassword">パスワードを表示する</label>
          </div>
          <button className="btn black" onClick={handleLogin}>ログインして進む</button>
          {error && <p className="error">{error}</p>}
          <a href="#">パスワードをお忘れですか？</a>
        </div>

        <div className="login-right">
          <h3>会員登録がお済みでないお客様</h3>
          <p>会員登録がお済みでないお客様はこちらより新規会員登録へお進みください。</p>
          <button className="btn black" onClick={onRegister}>新規会員登録</button>
          <button className="btn view-only" onClick={onGuest}>閲覧専用として進む</button>
          <a href="#">メンバーズについて</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
