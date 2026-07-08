"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import type { Column, Task } from "@/app/generated/prisma/client";
import { TaskCard } from "@/components/task-card";
import { CreateTaskButton } from "@/components/create-task-button";

type ColumnWithTasks = Column & { tasks: Task[] };

export function BoardColumn({ column }: { column: ColumnWithTasks }) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(column.title);
    const [menuOpen, setMenuOpen] = useState(false);

    const saveTitle = async () => {
        setEditing(false);
        if (title.trim() === "" || title === column.title) {
            setTitle(column.title);
            return;
        }
        await fetch(`/api/columns/${column.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        router.refresh();
    };

    const deleteColumn = async () => {
        if (!confirm(`Delete "${column.title}" and all its tasks?`)) return;
        await fetch(`/api/columns/${column.id}`, { method: "DELETE" });
        router.refresh();
    };

    return (
        <div className="flex w-72 flex-shrink-0 flex-col rounded-[12px] bg-background-secondary p-4">
            <div className="flex items-center justify-between">
                {editing ? (
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                        className="w-full rounded-[8px] border border-primary bg-surface px-2 py-1 text-sm font-semibold text-text-primary outline-none"
                    />
                ) : (
                    <h2
                        onClick={() => setEditing(true)}
                        className="cursor-text font-semibold text-text-primary"
                    >
                        {column.title}
                    </h2>
                )}

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="text-text-secondary transition-colors hover:text-text-primary"
                        aria-label="Column options"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-6 z-10 w-36 rounded-[10px] border border-border bg-background-secondary p-1 shadow-lg">
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    setEditing(true);
                                }}
                                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-text-primary hover:bg-surface"
                            >
                                <Pencil size={14} /> Rename
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    deleteColumn();
                                }}
                                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-error hover:bg-surface"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-1 text-xs text-text-secondary">
                {column.tasks.length} {column.tasks.length === 1 ? "task" : "tasks"}
            </p>

            <div className="mt-4 flex flex-1 flex-col gap-2">
                {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                <CreateTaskButton columnId={column.id} />
            </div>
        </div>
    );
}