import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Za-z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
    });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;