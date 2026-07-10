"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Label } from "@/app/generated/prisma/client";
import type { TaskWithLabels } from "@/lib/types";
import { TaskLabelPicker } from "@/components/task-label-picker";

export function TaskCard({
    task,
    boardLabels,
}: {
    task: TaskWithLabels;
    boardLabels: Label[];
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const toggleComplete = async () => {
        setPending(true);
        await fetch(`/api/tasks/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted: !task.isCompleted }),
        });
        setPending(false);
        router.refresh();
    };

    const deleteTask = async () => {
        await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
        router.refresh();
    };

    return (
        <div className="group flex flex-col gap-2 rounded-[10px] border border-border bg-background p-3">
            {task.taskLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {task.taskLabels.map(({ label }) => (
                        <span
                            key={label.id}
                            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                            style={{ backgroundColor: label.color }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={toggleComplete}
                    disabled={pending}
                    className="mt-0.5 h-4 w-4 accent-primary"
                />
                <p
                    className={`flex-1 text-sm ${task.isCompleted
                            ? "text-text-disabled line-through"
                            : "text-text-primary"
                        }`}
                >
                    {task.title}
                </p>
                <TaskLabelPicker task={task} boardLabels={boardLabels} />
                <button
                    onClick={deleteTask}
                    className="text-text-disabled opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
                    aria-label="Delete task"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}