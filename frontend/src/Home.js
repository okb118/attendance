import React, { useEffect, useState, useCallback } from "react";
import Calendar from "./Calendar";

function Home({ username, onLogout }) {
  const [statusList, setStatusList] = useState([]);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [logs, setLogs] = useState([]);

  const fetchStatusList = useCallback(async () => {
    const res = await fetch("http://localhost:5000/status");
    const data = await res.json();
    setStatusList(data);
  }, []);

  const fetchLogs = useCallback(async () => {
    const res = await fetch(`http://localhost:5000/logs?username=${username}`);
    const data = await res.json();
    setLogs(data);
  }, [username]);

  useEffect(() => {
    fetchStatusList();
    fetchLogs();
  }, [fetchStatusList, fetchLogs]); // ← 正しく依存関係を指定

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("ja-JP", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClock = async (type) => {
    const res = await fetch(`http://localhost:5000/clock-${type}?username=${username}`, {
      method: "POST",
    });
    const data = await res.json();
    setMessage(data.message);
    fetchStatusList();
    fetchLogs();
  };

  return (
    <div>
      <h2>{username} さん</h2>
      <p>現在時刻：{time}</p>
      <button onClick={() => handleClock("in")}>出勤</button>
      <button onClick={() => handleClock("out")}>退勤</button>
      <button onClick={onLogout}>ログアウト</button>
      <p>{message}</p>

      <h3>出退勤ログ</h3>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>{log.action} - {new Date(log.time).toLocaleString()}</li>
        ))}
      </ul>

      <h3>メンバーの出退勤ステータス</h3>
      {statusList.map((status, i) => (
        <p key={i}>{status.username}: {status.status}</p>
      ))}

      <Calendar username={username} />
    </div>
  );
}

export default Home;