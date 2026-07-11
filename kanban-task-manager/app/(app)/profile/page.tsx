import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/login");
    }

    const initials = session.user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const memberSince = new Date(session.user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="p-4 lg:p-8">
            <h1 className="text-[32px] font-bold text-text-primary">Profile</h1>
            <p className="mt-2 text-text-secondary">Manage your account.</p>

            <div className="mt-8 max-w-3xl">
                <div className="flex items-center gap-4 rounded-[12px] border border-border bg-background-secondary p-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
                        {initials}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-text-primary">
                            {session.user.name}
                        </p>
                        <p className="text-sm text-text-secondary">{session.user.email}</p>
                        <p className="mt-1 text-xs text-text-disabled">
                            Member since {memberSince}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <ProfileForm currentName={session.user.name} email={session.user.email} />
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}