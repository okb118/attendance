import { useState } from "react";

function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setMsg("登録完了！ログインしてください");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div>
      <h2>新規登録</h2>
      <input
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>登録</button>
      <button onClick={onBack}>ログインへ戻る</button>
      <p>{msg}</p>
    </div>
  );
}

export default Register;
