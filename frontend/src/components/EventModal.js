// src/components/EventModal.js
import React, { useState } from "react";

function EventModal({ date, username, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(date.toISOString().slice(0, 16));
  const [end, setEnd] = useState(date.toISOString().slice(0, 16));
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState("#3182ce");

  const handleSubmit = () => {
    if (!title || !start || !end) {
      alert("全ての項目を入力してください");
      return;
    }

    onSave({
      user: username,
      title,
      start,
      end,
      all_day: allDay,
      color,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>予定を追加</h3>
        <label>
          タイトル：
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          開始日時：
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          終了日時：
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label>
          終日：
          <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
        </label>
        <label>
          色：
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>保存</button>
          <button onClick={onClose}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;