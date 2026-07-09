"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/app/generated/prisma/client";

export function TaskCard({ task }: { task: Task }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-start gap-2 rounded-[10px] border border-border bg-background p-3"
        >
            <button
                {...attributes}
                {...listeners}
                className="mt-0.5 cursor-grab text-text-disabled opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100"
                aria-label="Drag to reorder"
            >
                <GripVertical size={14} />
            </button>
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