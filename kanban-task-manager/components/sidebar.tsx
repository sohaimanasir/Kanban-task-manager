import { Logo } from "@/components/logo";
import { SidebarContent } from "@/components/sidebar-content";

export function Sidebar({ user }: { user: { name: string; email: string } }) {
    return (
        <aside className="fixed hidden h-screen w-64 flex-col border-r border-border bg-background-secondary p-6 lg:flex">
            <Logo />
            <SidebarContent user={user} />
        </aside>
    );
}