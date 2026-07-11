"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import {
    changePasswordSchema,
    type ChangePasswordInput,
} from "@/lib/validations/profile";
import { authClient } from "@/lib/auth-client";
import { PasswordField } from "@/components/ui/password-field";

export function ChangePasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordInput) => {
        setServerError(null);
        setSuccess(false);

        const { error } = await authClient.changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });

        if (error) {
            setServerError(error.message ?? "Couldn't change password");
            return;
        }

        reset();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
        <div className="rounded-[12px] border border-border bg-background-secondary p-5">
            <h2 className="font-semibold text-text-primary">Change password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                <PasswordField
                    id="currentPassword"
                    label="Current password"
                    error={errors.currentPassword?.message}
                    {...register("currentPassword")}
                />
                <PasswordField
                    id="newPassword"
                    label="New password"
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                />
                {serverError && <p className="text-sm text-error">{serverError}</p>}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                    >
                        {isSubmitting ? "Updating..." : "Update password"}
                    </button>
                    {success && (
                        <span className="flex items-center gap-1 text-sm text-success">
                            <Check size={14} /> Password updated
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}