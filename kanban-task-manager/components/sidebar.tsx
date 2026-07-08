"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User } from "lucide-react";
import { Logo } from "./logo";
import { LogoutButton } from "./logout-button";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar({ user }: { user: { name: string; email: string } }) {
    const pathname = usePathname();

    return (
        <aside className="fixed hidden h-screen w-64 flex-col border-r border-border bg-background-secondary p-6 lg:flex">
            <Logo />

            <nav className="mt-10 flex flex-col gap-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors ${active
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                                }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-border pt-4">
                <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
                <p className="truncate text-xs text-text-secondary">{user.email}</p>
                <div className="mt-3">
                    <LogoutButton />
                </div>
            </div>
        </aside>
    );
}