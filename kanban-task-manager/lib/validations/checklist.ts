import { z } from "zod";

export const createChecklistItemSchema = z.object({
    title: z.string().min(1, "Item text is required").max(200),
});

export const updateChecklistItemSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    completed: z.boolean().optional(),
});

export type CreateChecklistItemInput = z.infer<typeof createChecklistItemSchema>;
export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>;