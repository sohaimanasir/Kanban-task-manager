import Link from "next/link";
import type { Task } from "@/app/generated/prisma/client";

type TaskWithBoard = Task & { column: { board: { id: string; title: string } } };

export function DashboardTaskList({
    title,
    tasks,
    accentColor,
}: {
    title: string;
    tasks: TaskWithBoard[];
    accentColor: string;
}) {
    return (
        <div className="rounded-[12px] border border-border bg-background-secondary p-4">
            <div className="flex items-center gap-2">
                <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                />
                <h3 className="font-semibold text-text-primary">{title}</h3>
                <span className="text-sm text-text-secondary">({tasks.length})</span>
            </div>
            <div className="mt-3 space-y-1">
                {tasks.map((task) => (
                    <Link
                        key={task.id}
                        href={`/boards/${task.column.board.id}`}
                        className="flex items-center justify-between rounded-[8px] px-2 py-1.5 text-sm hover:bg-surface"
                    >
                        <span className="truncate text-text-primary">{task.title}</span>
                        <span className="shrink-0 text-xs text-text-disabled">
                            {task.column.board.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}