"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Sidebar } from "@/components/sidebar";
import { SidebarContent } from "@/components/sidebar-content";

export function AppShell({
    user,
    children,
}: {
    user: { name: string; email: string };
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border bg-background-secondary px-4 py-3 lg:hidden">
                <Logo />
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="text-text-primary"
                >
                    <Menu size={22} />
                </button>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-background-secondary p-6">
                        <div className="flex items-center justify-between">
                            <Logo />
                            <button
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                                className="text-text-secondary hover:text-text-primary"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <Sidebar user={user} />

            <main className="flex-1 pt-16 lg:ml-64 lg:pt-0">{children}</main>
        </div>
    );
}