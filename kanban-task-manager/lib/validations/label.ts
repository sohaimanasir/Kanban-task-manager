import { z } from "zod";

export const createLabelSchema = z.object({
    name: z.string().min(1, "Name is required").max(30),
    color: z.string().min(1, "Pick a color"),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;