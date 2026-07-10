"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { Task } from "@/app/generated/prisma/client";

export function TaskCard({ task }: { task: Task }) {
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
        <div className="group flex items-start gap-2 rounded-[10px] border border-border bg-background p-3">
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
            <button
                onClick={deleteTask}
                className="text-text-disabled opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
                aria-label="Delete task"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}