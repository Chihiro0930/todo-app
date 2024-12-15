"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  // タスクを取得する
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error) setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // タスクを追加する
  const addTodo = async () => {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ task: newTask }])
      .select("*");
    if (!error) setTodos((prev) => [...prev, ...(data || [])]);
    setNewTask("");
  };

  // 完了状態を切り替える
  const toggleComplete = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_complete: !currentState })
      .eq("id", id);
    if (!error) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, is_complete: !currentState } : todo
        )
      );
    }
  };

  return (
    <main>
      <h1>Todoリスト</h1>
      {/* 新しいタスク入力フォーム */}
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="新しいタスクを追加"
      />
      <button onClick={addTodo}>追加</button>

      {/* タスク一覧 */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.is_complete ? "line-through" : "none",
              }}
            >
              {todo.task}
            </span>
            <button onClick={() => toggleComplete(todo.id, todo.is_complete)}>
              {todo.is_complete ? "未完了に戻す" : "完了"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
