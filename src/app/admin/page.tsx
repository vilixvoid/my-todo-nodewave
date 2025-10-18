"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Home, LogOut } from "lucide-react";
import { useAdminTodos } from "@/hooks/useAdminTodos";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => setIsClient(true), []);

  const { data, isLoading, isError, refetch } = useAdminTodos(page, {
    search: searchTerm,
    isDone: statusFilter === "Success" ? true : statusFilter === "Pending" ? false : undefined,
  });

  const todos = data?.entries ?? [];
  const totalPage = data?.totalPage ?? 1;

  // ✅ Toggle todo status
  const handleToggleStatus = async (id: string, isDone: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://fe-test-api.nwappservice.com/todos/${id}/mark`,
        { action: isDone ? "UNDONE" : "DONE" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refetch();
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("auth/login");
  };

  if (!isClient) return null;

  return (
    <div className="flex min-h-screen bg-[#F9FAFC]">
      {/* === SIDEBAR === */}
      <aside className="w-60 border-r bg-white flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h1 className="text-lg font-semibold text-gray-700">Nodewave</h1>
          <ChevronLeft size={18} className="text-gray-400" />
        </div>

        <nav className="flex flex-col mt-3">
          <button className="flex items-center gap-3 px-5 py-2.5 bg-[#F1F5F9] rounded-md mx-3 text-[#1A56DB] font-medium">
            <Home size={18} />
            <span>To do</span>
          </button>
        </nav>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 p-8">
        {/* Top Navbar */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">Ahmad Akbar</span>
            <div className="relative">
              <Image
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-9 h-9 rounded-full border"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 text-gray-400 hover:text-red-500 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">To Do</h1>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center border rounded-lg bg-white px-3 py-2 w-64">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="bg-[#1A56DB] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1747B0] transition"
          >
            Search
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">Filter by Status</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">To do</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">
                    Loading todos...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-red-500">
                    Error fetching data
                  </td>
                </tr>
              ) : todos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">
                    No todos found 💤
                  </td>
                </tr>
              ) : (
                todos.map((todo: any) => (
                  <tr key={todo.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">
                      {todo.user?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{todo.item}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(todo.id, todo.isDone)}
                        className={`px-4 py-1 rounded-full text-xs font-medium ${
                          todo.isDone
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {todo.isDone ? "Success" : "Pending"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 space-x-2">
        {/* Tombol Previous */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`p-2 rounded-md border ${
            page === 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Button Page*/}
        {(() => {
          const visiblePages = 2;
          const startPage = Math.floor((page - 1) / visiblePages) * visiblePages + 1;
          const endPage = Math.min(startPage + visiblePages - 1, totalPage);

          const buttons = [];
          for (let i = startPage; i <= endPage; i++) {
            buttons.push(
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-md border text-sm ${
                  page === i
                    ? "bg-[#1A56DB] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i}
              </button>
            );
          }
          return buttons;
        })()}

        {/* Tombol Next */}
        {page < totalPage && (
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPage))}
            className="p-2 rounded-md border hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
      </main>
    </div>
  );
}
