const BASE_URL = "http://localhost:5001/events";

export async function fetchEvents() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("イベントの取得に失敗しました");
  return res.json();
}

export async function addEvent(eventData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error("イベントの追加に失敗しました");
  return res.json();
}

export async function deleteEvent(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("イベントの削除に失敗しました");
  return res.json();
}
