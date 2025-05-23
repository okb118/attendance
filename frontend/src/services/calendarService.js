// src/services/calendarService.js

export async function fetchEvents() {
  const res = await fetch("http://localhost:5001/events");
  if (!res.ok) throw new Error("イベントの取得に失敗しました");
  return await res.json();
}

export async function addEvent(eventData) {
  const res = await fetch("http://localhost:5001/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error("イベントの追加に失敗しました");
  return await res.json();
}

export async function deleteEvent(id) {
  const res = await fetch(`http://localhost:5001/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("イベントの削除に失敗しました");
  return await res.json();
}