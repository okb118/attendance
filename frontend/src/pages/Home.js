import React, { useEffect, useState } from "react";
import StatusList from "../components/StatusList";
import Sidebar from "../components/Sidebar";
import "../styles/Sidebar.css";

function Home({ username, onLogout }) {
  const [statusList, setStatusList] = useState([]);
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");

  const fetchStatusList = async () => {
    try {
      const res = await fetch("http://localhost:5001/status");
      const data = await res.json();
      setStatusList(data);
    } catch (err) {
      console.error("ステータス取得エラー:", err);
    }
  };

  const handleClock = async (type) => {
    try {
      const res = await fetch(`http://localhost:5001/clock-${type}?username=${username}`, {
        method: "POST",
      });
      const data = await res.json();
      setMessage(data.message);
      fetchStatusList();
    } catch (err) {
      console.error("打刻エラー:", err);
    }
  };

  useEffect(() => {
    fetchStatusList();
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("ja-JP", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px", flex: 1 }}>
        <h2>{username} さん</h2>
        <p>現在時刻：{time}</p>
        <button onClick={() => handleClock("in")}>出勤</button>
        <button onClick={() => handleClock("out")}>退勤</button>
        <button onClick={onLogout}>ログアウト</button>
        <p>{message}</p>

        <StatusList statusList={statusList} />

      </div>
    </div>
  );
}

export default Home;
