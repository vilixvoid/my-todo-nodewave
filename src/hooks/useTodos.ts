import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

/**
 * GET all todos
 */
export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos");
      return res.data?.content?.entries || [];
    },
    refetchOnWindowFocus: false,
  });
};

/**
 * CREATE todo (default isDone: true)
 */
export const useCreateTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { item: string; isDone?: boolean }) => {
      const res = await api.post("/todos", {
        item: body.item,
        isDone: body.isDone ?? true, // default true
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

/**
 * TOGGLE todo
 * - toggle dari true → false atau false → true
 * - mengirim body { isDone: newValue }
 */
export const useToggleTodo = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; isDone: boolean }) => {
  const action = payload.isDone ? "UNDONE" : "DONE";

  console.log("Toggle todo:", payload.id, action); // debug

  const res = await api.put(
    `/todos/${payload.id}/mark`,
    { action },
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data;
},


    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ["todos"] });
      const previous = qc.getQueryData<any[]>(["todos"]);

      qc.setQueryData<any[]>(["todos"], (old = []) =>
        old.map((t) =>
          t.id === payload.id ? { ...t, isDone: !payload.isDone } : t
        )
      );

      return { previous };
    },

    onError: (err, _, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(["todos"], ctx.previous);
      console.error("Toggle todo failed:", err);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};


/**
 * DELETE todo
 */
export const useDeleteTodo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/todos/${id}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
  });
};
