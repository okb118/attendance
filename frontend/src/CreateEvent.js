import React, { useState } from "react";

function CreateEvent({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [user, setUser] = useState("user1");  // ※ 必要に応じて props.username にする
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          start,
          end,
          user,
          color: "#3182ce"
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "エラーが発生しました");
      }

      const data = await response.json();
      setMessage("イベントを登録しました！");
      setTitle(""); setStart(""); setEnd("");

      if (onEventCreated) onEventCreated(data); // 新規イベント登録後に呼ばれる
    } catch (error) {
      setMessage(`登録失敗: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>イベント登録</h3>
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br />
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      /><br />
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      /><br />
      <button onClick={handleSubmit}>登録</button>
      <p>{message}</p>
    </div>
  );
}

export default CreateEvent;
