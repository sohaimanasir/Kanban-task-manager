"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import type { Label } from "@/app/generated/prisma/client";
import type { TaskWithLabels } from "@/lib/types";

export function TaskLabelPicker({
    task,
    boardLabels,
}: {
    task: TaskWithLabels;
    boardLabels: Label[];
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const assignedIds = new Set(task.taskLabels.map((tl) => tl.labelId));

    const toggle = async (labelId: string) => {
        if (assignedIds.has(labelId)) {
            await fetch(`/api/tasks/${task.id}/labels?labelId=${labelId}`, {
                method: "DELETE",
            });
        } else {
            await fetch(`/api/tasks/${task.id}/labels`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ labelId }),
            });
        }
        router.refresh();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="text-text-disabled opacity-0 transition-opacity hover:text-text-primary group-hover:opacity-100"
                aria-label="Labels"
            >
                <Tag size={14} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-5 z-20 w-44 rounded-[10px] border border-border bg-background-secondary p-1 shadow-lg">
                        {boardLabels.length === 0 ? (
                            <p className="px-2 py-1.5 text-xs text-text-secondary">
                                No labels on this board yet.
                            </p>
                        ) : (
                            boardLabels.map((label) => (
                                <button
                                    key={label.id}
                                    onClick={() => toggle(label.id)}
                                    className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-text-primary hover:bg-surface"
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: label.color }}
                                    />
                                    <span className="flex-1 text-left">{label.name}</span>
                                    {assignedIds.has(label.id) && (
                                        <span className="text-primary">✓</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}