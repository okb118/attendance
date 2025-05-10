import { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function Calendar({ username }) {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [username]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`http://localhost:5001/events`);
      const data = await res.json();
      const formatted = data.map((e) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
        allDay: false,
      }));
      setEvents(formatted);
    } catch (err) {
      console.error("イベント取得エラー:", err);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const res = await fetch("http://localhost:5001/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: username,
          title,
          start,
          end,
          color: "#38bdf8",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("作成エラー: " + err.detail);
        return;
      }

      setTitle("");
      setStart("");
      setEnd("");
      fetchEvents();
    } catch (err) {
      console.error("作成失敗:", err);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await fetch(`http://localhost:5001/events/${eventId}`, {
        method: "DELETE",
      });
      fetchEvents();
    } catch (err) {
      console.error("削除失敗:", err);
    }
  };

  return (
    <div>
      <h3>共有カレンダー</h3>

      <div>
        <input
          type="text"
          placeholder="予定のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button onClick={handleCreateEvent}>追加</button>
      </div>

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title}（{event.user}）{" "}
            {event.user === username && (
              <button onClick={() => handleDelete(event.id)}>削除</button>
            )}
          </li>
        ))}
      </ul>

      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginTop: 20 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.user === username ? "#38bdf8" : "#aaa",
          },
        })}
      />
    </div>
  );
}

export default Calendar;
