import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
            <p className="text-sm text-text-secondary">Logged in as</p>
            <h1 className="mt-1 text-2xl font-semibold text-text-primary">
                {session.user.name}
            </h1>
            <p className="mt-1 text-text-secondary">{session.user.email}</p>
            <div className="mt-8">
                <LogoutButton />
            </div>
        </div>
    );
}