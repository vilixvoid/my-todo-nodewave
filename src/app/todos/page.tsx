"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, LogOut, Trash2 } from "lucide-react";
import {
  useTodos,
  useCreateTodo,
  useToggleTodo,
  useDeleteTodo,
} from "@/hooks/useTodos";

type Todo = {
  id: string;
  item: string;
  isDone: boolean;
};

export default function TodoPage() {
  const { data: todos = [], isLoading } = useTodos();
  const { mutate: addTodo } = useCreateTodo();
  const { mutate: toggleTodo } = useToggleTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  const [task, setTask] = useState("");
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [fullName, setFullName] = useState("User");

  // 🟦 Sinkronisasi todo dari server — default semua true
  useEffect(() => {
    if (todos.length > 0 && localTodos.length === 0) {
      setLocalTodos(todos.map((t: Todo) => ({ ...t, isDone: true })));
    } else if (todos.length !== localTodos.length) {
      setLocalTodos(todos);
    }
  }, [todos]);

  // 🟩 Ambil nama user dari localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.fullName) setFullName(parsed.fullName);
      } catch (err) {
        console.error("Invalid user data:", err);
      }
    }
  }, []);

  // 🟨 Tambah todo baru (default true)
  const handleAddTodo = () => {
    if (!task.trim()) return;
    addTodo({ item: task, isDone: true });

    const newTodo: Todo = {
      id: Date.now().toString(),
      item: task,
      isDone: true,
    };
    setLocalTodos((prev) => [...prev, newTodo]);
    setTask("");
  };

  // 🟧 Klik checkbox = toggle + pilih untuk delete
  const handleCheckbox = (id: string, isDone: boolean) => {
    // Toggle status (done/undone)
    setLocalTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isDone: !isDone } : todo
      )
    );
    toggleTodo({ id, isDone });

    // Tandai sebagai "terpilih untuk delete"
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // 🗑️ Hapus todo terpilih
  const handleSelectedDelete = () => {
    if (selectedIds.length === 0) {
      alert("Tidak ada todo yang dipilih!");
      return;
    }
    if (confirm(`Yakin ingin menghapus ${selectedIds.length} todo?`)) {
      setLocalTodos((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
      selectedIds.forEach((id) => deleteTodo(id));
      setSelectedIds([]);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    if (confirm("Apakah kamu yakin ingin logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
  };

  if (isLoading && localTodos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading todos...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-200">
        <div className="flex items-center text-gray-400 text-sm">
          <span className="mr-2">⭐</span> Search (Ctrl+/)
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-medium">{fullName}</span>
            <div className="relative">
              <Image
                src={`https://api.dicebear.com/9.x/adventurer/png?seed=${encodeURIComponent(fullName)}`}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full border"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-[#1A56DB] mb-8">To Do</h1>

        <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg border border-gray-100">
          {/* Add Task */}
          <p className="text-sm font-semibold text-gray-600 mb-2">
            Add a new task
          </p>
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter a task"
              className="flex-1 border-b-2 border-[#1A56DB] focus:outline-none focus:border-[#1A56DB] px-1 py-2 text-lg font-semibold text-gray-800"
            />
            <button
              onClick={handleAddTodo}
              className="bg-[#1A56DB] text-white font-semibold px-5 py-2 rounded-md hover:bg-[#1747b3] transition text-sm"
            >
              Add Todo
            </button>
          </div>

          {/* Todo List */}
          <div className="divide-y mb-6">
            {localTodos.length === 0 ? (
              <p className="text-center text-gray-400 py-6">No todos yet 💤</p>
            ) : (
              localTodos.map((todo) => {
                const done = Boolean(todo.isDone);
                const selected = selectedIds.includes(todo.id);

                return (
                  <div
                    key={todo.id}
                    className={`flex justify-between items-center py-3 px-2 rounded-md transition ${
                      selected ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Checkbox tunggal */}
                      <input
                        type="checkbox"
                        checked={!done}
                        onChange={() => handleCheckbox(todo.id, done)}
                        className="w-5 h-5 accent-[#1A56DB] cursor-pointer"
                      />

                      {/* Klik teks juga toggle */}
                      <span
                        onClick={() => handleCheckbox(todo.id, done)}
                        className={`text-lg cursor-pointer select-none ${
                          done
                            ? "text-gray-800 font-semibold"
                            : "line-through text-gray-400"
                        }`}
                      >
                        {todo.item}
                      </span>
                    </div>

                    {/* Icon status */}
                    {done ? (
                      <CheckCircle className="text-green-500 w-6 h-6" />
                    ) : (
                      <XCircle className="text-red-500 w-6 h-6" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Delete Button */}
          {selectedIds.length > 0 && (
            <button
              onClick={handleSelectedDelete}
              className="w-full flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
