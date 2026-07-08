"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-[10px] border border-border px-5 py-2.5 font-medium text-text-primary transition-colors hover:border-error hover:text-error"
        >
            Log out
        </button>
    );
}