"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type Todo = {
  id: string;
  task: string;
  is_complete: boolean;
  created_at: string;
};


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Page = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  // タスクの取得
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // タスクの追加
  const addTodo = async () => {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task: newTask }])
      .select('*');
    if (!error) {
      setTodos((prev) => [...prev, ...(data || [])]);
      setNewTask('');
    }
  };

  // タスクの完了状態の切り替え
  const toggleComplete = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !currentState })
      .eq('id', id);
    if (!error) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, is_complete: !currentState } : todo
        )
      );
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTodo}>Add Task</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}>
            {todo.task}
            <button onClick={() => toggleComplete(todo.id, todo.is_complete)}>
              {todo.is_complete ? 'Undo' : 'Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
