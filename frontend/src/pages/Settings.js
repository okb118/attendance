import React, { useState } from "react";
import "../styles/Settings.css";

function Settings({ onLogout }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`settings-container ${theme}`}>
      <h2>⚙️ 設定</h2>

      <div className="settings-card">
        <h3>🧑‍💻 プロフィール設定</h3>
        <label>表示名の変更</label>
        <input type="text" placeholder="新しい表示名" />
        <label>パスワードの変更</label>
        <input type="password" placeholder="新しいパスワード" />
      </div>

      <div className="settings-card">
        <h3>🖼 表示設定</h3>
        <label>テーマ切替</label>
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 ダークモードに切替" : "☀️ ライトモードに切替"}
        </button>
      </div>

      <div className="settings-card">
        <h3>🚪 アカウント操作</h3>
        <button className="logout-btn" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
}

export default Settings;

