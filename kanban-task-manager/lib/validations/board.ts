import { z } from "zod";

export const createBoardSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(500).optional(),
    color: z.string().min(1, "Pick a color"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;