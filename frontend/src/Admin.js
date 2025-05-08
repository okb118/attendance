import { useEffect, useState } from "react";

function Admin({ admin, onLogout }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");

  const loadUsers = async () => {
    try {
      const res = await fetch(`http://localhost:8000/admin/users?admin=${admin}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("ユーザー取得エラー:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch(`http://localhost:8000/admin/users?admin=${admin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUser, password: newPass }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`登録失敗: ${data.detail}`);
        return;
      }
      setNewUser("");
      setNewPass("");
      loadUsers();
    } catch (err) {
      console.error("登録エラー:", err);
    }
  };

  const handleDelete = async (username) => {
    try {
      const res = await fetch(`http://localhost:8000/admin/users/${username}?admin=${admin}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(`削除失敗: ${data.detail}`);
        return;
      }
      loadUsers();
    } catch (err) {
      console.error("削除エラー:", err);
    }
  };

  return (
    <div>
      <h2>管理者メニュー</h2>
      <button onClick={onLogout}>ログアウト</button>

      <h3>新規ユーザー登録</h3>
      <input
        placeholder="ユーザー名"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />
      <button onClick={handleCreate}>登録</button>

      <h3>ユーザー一覧</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} {u.is_admin ? "(管理者)" : ""}
            <button onClick={() => handleDelete(u.username)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
