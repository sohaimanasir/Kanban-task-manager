import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary">
                <span className="h-2.5 w-2.5 rounded-full bg-background" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
                Kanban
            </span>
        </Link>
    );
}