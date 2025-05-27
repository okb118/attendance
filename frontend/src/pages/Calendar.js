import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { fetchEvents, addEvent } from "../services/calendarService";

function Calendar({ username }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  const handleDateClick = async (info) => {
    const title = window.prompt("予定のタイトルを入力してください:");
    if (title) {
      const newEvent = {
        title,
        user: username,
        start: info.dateStr,
        end: info.dateStr,
        all_day: true,
        color: "#63b3ed"
      };
      await addEvent(newEvent);
      await loadEvents();
    }
  };

  return (
    <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        locales={[jaLocale]}
        locale="ja"
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />
    </div>
  );
}

export default Calendar;
