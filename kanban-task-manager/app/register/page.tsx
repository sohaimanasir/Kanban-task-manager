"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth-layout";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setServerError(null);
        const { error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
        });
        if (error) {
            setServerError(error.message ?? "Something went wrong");
            return;
        }
        router.push("/dashboard");
    };

    return (
        <AuthLayout
            eyebrow="Get started"
            title="Create your account"
            subtitle="Set up your workspace in less than a minute."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <TextField
                    id="name"
                    label="Name"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register("name")}
                />
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <PasswordField
                    id="password"
                    label="Password"
                    placeholder="At least 8 characters"
                    error={errors.password?.message}
                    {...register("password")}
                />

                {serverError && (
                    <p className="rounded-[10px] border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-[10px] bg-primary px-4 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                >
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
}