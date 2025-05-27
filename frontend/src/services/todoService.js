const API = "http://localhost:5001";

export async function fetchTodos(user) {
  const res = await fetch(`${API}/todos?user=${user}`);
  return await res.json();
}

export async function addTodo(todo) {
  await fetch(`${API}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
}

export async function toggleTodo(id) {
  await fetch(`${API}/todos/${id}`, {
    method: "PUT",
  });
}

export async function deleteTodo(id) {
  await fetch(`${API}/todos/${id}`, {
    method: "DELETE",
  });
}
