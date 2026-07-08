import Link from "next/link";
import type { Board } from "@/app/generated/prisma/client";

export function BoardCard({ board }: { board: Board }) {
    return (
        <Link
            href={`/boards/${board.id}`}
            className="group rounded-[12px] border border-border bg-background-secondary p-5 transition-colors hover:border-primary"
        >
            <div className="flex items-center gap-2">
                <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: board.color }}
                />
                <h3 className="font-semibold text-text-primary">{board.title}</h3>
            </div>
            {board.description && (
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                    {board.description}
                </p>
            )}
        </Link>
    );
}