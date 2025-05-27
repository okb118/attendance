import React, { useState, useEffect, useCallback } from "react";
import { fetchTodos, addTodo, toggleTodo, deleteTodo } from "../services/todoService";

function Todo({ username }) {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  // ✅ loadTodosを useCallback でメモ化
  const loadTodos = useCallback(async () => {
    if (!username) return;
    const data = await fetchTodos(username);
    setTodos(data);
  }, [username]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]); // ✅ 依存関係は useCallback済みの関数なのでOK

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await addTodo({ title: newTitle, user: username });
    setNewTitle("");
    loadTodos();
  };

  const handleToggle = async (id) => {
    await toggleTodo(id);
    loadTodos();
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    loadTodos();
  };

  return (
    <div>
      <h2>ToDoリスト</h2>
      <input
        type="text"
        placeholder="新しいタスク"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            {todo.title}
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
