import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios"; // pastikan path sesuai struktur project kamu

export function useAdminTodos(page: number = 1, filters?: any) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return useQuery({
    queryKey: ["admin-todos", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        rows: "10",
        orderKey: "createdAt",
        orderRule: "desc",
      });

      if (filters?.isDone !== undefined) {
        params.append("filters", JSON.stringify({ isDone: filters.isDone }));
      }

      if (filters?.search) {
        params.append("searchFilters", JSON.stringify({ item: filters.search }));
      }

      // Memanggil API dari instance axios yang sudah include baseURL
      const res = await api.get(`/todos?${params.toString()}`);
      const todos = res.data?.content?.entries ?? [];

      // Mengambil data user berdasarkan userId
      const usersCache: Record<string, any> = {};

      const todosWithUser = await Promise.all(
        todos.map(async (todo: any) => {
          if (!todo.userId) return todo;
          if (!usersCache[todo.userId]) {
            try {
              const userRes = await api.get(`/users/${todo.userId}`);
              const userData = userRes.data?.content ?? userRes.data;
              usersCache[todo.userId] = userData;
            } catch {
              usersCache[todo.userId] = { name: "Unknown" };
            }
          }
          return { ...todo, user: usersCache[todo.userId] };
        })
      );

      return {
        entries: todosWithUser,
        totalPage: res.data?.content?.totalPage ?? 1,
      };
    },
    enabled: !!token,
  });
}
