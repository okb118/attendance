import React, { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function Calendar({ username }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`http://localhost:5000/events?user=${username}`);
        const data = await res.json();
        const formatted = data.map((e) => ({
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end),
          allDay: false,
        }));
        setEvents(formatted);
      } catch (err) {
        console.error("イベント取得エラー:", err);
      }
    };

    fetchEvents();
  }, [username]);

  return (
    <div>
      <h3>カレンダー</h3>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default Calendar;