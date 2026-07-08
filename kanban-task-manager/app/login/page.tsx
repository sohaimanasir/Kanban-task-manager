"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { authClient } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth-layout";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";

export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setServerError(null);
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        });
        if (error) {
            setServerError(error.message ?? "Invalid email or password");
            return;
        }
        router.push("/dashboard");
    };

    return (
        <AuthLayout
            eyebrow="Welcome back"
            title="Log in"
            subtitle="Pick up right where you left off."
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                    placeholder="Your password"
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
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-primary hover:text-primary-hover">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}