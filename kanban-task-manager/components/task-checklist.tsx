"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import type { TaskWithLabels } from "@/lib/types";

export function TaskChecklist({ task }: { task: TaskWithLabels }) {
    const router = useRouter();
    const [newItem, setNewItem] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const items = task.checklist?.items ?? [];
    const completedCount = items.filter((i) => i.completed).length;

    const addItem = async () => {
        if (newItem.trim() === "") return;
        setSubmitting(true);
        await fetch(`/api/tasks/${task.id}/checklist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newItem }),
        });
        setSubmitting(false);
        setNewItem("");
        router.refresh();
    };

    const toggleItem = async (itemId: string, completed: boolean) => {
        await fetch(`/api/checklist-items/${itemId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }),
        });
        router.refresh();
    };

    const deleteItem = async (itemId: string) => {
        await fetch(`/api/checklist-items/${itemId}`, { method: "DELETE" });
        router.refresh();
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text-primary">
                    Checklist
                </label>
                {items.length > 0 && (
                    <span className="text-xs text-text-secondary">
                        {completedCount}/{items.length}
                    </span>
                )}
            </div>

            {items.length > 0 && (
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                    <div
                        className="h-full bg-primary transition-all"
                        style={{
                            width: `${items.length ? (completedCount / items.length) * 100 : 0}%`,
                        }}
                    />
                </div>
            )}

            <div className="mt-3 space-y-1.5">
                {items.map((item) => (
                    <div key={item.id} className="group flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleItem(item.id, item.completed)}
                            className="h-4 w-4 accent-primary"
                        />
                        <span
                            className={`flex-1 text-sm ${item.completed
                                    ? "text-text-disabled line-through"
                                    : "text-text-primary"
                                }`}
                        >
                            {item.title}
                        </span>
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="text-text-disabled opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
                            aria-label="Delete item"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex gap-2">
                <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addItem()}
                    placeholder="Add an item..."
                    disabled={submitting}
                    className="flex-1 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-sm text-text-primary outline-none placeholder:text-text-disabled focus:border-primary"
                />
                <button
                    onClick={addItem}
                    disabled={submitting}
                    className="rounded-[10px] bg-primary px-2.5 text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                    aria-label="Add item"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}