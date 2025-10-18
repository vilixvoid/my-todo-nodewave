import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  due_date: z.string().optional(), // iso string
});
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
