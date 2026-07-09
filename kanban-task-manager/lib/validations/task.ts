import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    isCompleted: z.boolean().optional(),
});

export const reorderTasksSchema = z.object({
    taskIds: z.array(z.string().uuid()).min(1),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;