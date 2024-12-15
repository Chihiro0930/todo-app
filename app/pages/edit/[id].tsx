"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditTask() {
  const router = useRouter();
  const { id } = useParams();
  const [task, setTask] = useState("");

  const fetchTask = useCallback(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("task")
      .eq("id", id)
      .single();
    if (!error) setTask(data?.task || "");
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // タスクの更新
  const updateTask = async () => {
    await supabase.from("todos").update({ task }).eq("id", id);
    router.push("/");
  };

  // タスクの削除
  const deleteTask = async () => {
    if (confirm("本当に削除しますか？")) {
      await supabase.from("todos").delete().eq("id", id);
      router.push("/");
    }
  };

  return (
    <div>
      <h1>タスクを編集</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={updateTask}>更新</button>
      <button onClick={deleteTask}>削除</button>
    </div>
  );
}
