import { z } from "zod";

export const createColumnSchema = z.object({
    title: z.string().min(1, "Title is required").max(50),
});

export const updateColumnSchema = z.object({
    title: z.string().min(1, "Title is required").max(50),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;