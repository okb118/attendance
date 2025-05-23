// src/components/Calendar.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from '@fullcalendar/core/locales/ja';
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

  const handleDateClick = (info) => {
    const title = prompt("予定のタイトルを入力してください:");
    if (title) {
      const newEvent = {
        title,
        user: username,
        start: info.dateStr,
        end: info.dateStr,
        all_day: true,
        color: "#63b3ed",
      };
      addEvent(newEvent).then(loadEvents);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
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