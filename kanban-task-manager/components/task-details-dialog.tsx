"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Label } from "@/app/generated/prisma/client";
import type { TaskWithLabels } from "@/lib/types";
import { Modal } from "@/components/ui/modal";

const PRIORITIES = [
    { value: "LOW", label: "Low", color: "var(--color-info)" },
    { value: "MEDIUM", label: "Medium", color: "var(--color-warning)" },
    { value: "HIGH", label: "High", color: "var(--color-error)" },
] as const;

export function TaskDetailsDialog({
    task,
    boardLabels,
    open,
    onClose,
}: {
    task: TaskWithLabels;
    boardLabels: Label[];
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(
        task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""
    );
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
    const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const assignedIds = new Set(task.taskLabels.map((tl) => tl.labelId));

    const patch = async (data: Record<string, unknown>) => {
        setSaveState("saving");
        await fetch(`/api/tasks/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setSaveState("saved");
        if (savedTimeout.current) clearTimeout(savedTimeout.current);
        savedTimeout.current = setTimeout(() => setSaveState("idle"), 1500);
        router.refresh();
    };

    const saveTitle = () => {
        if (title.trim() !== "" && title !== task.title) patch({ title });
    };

    const saveDescription = () => {
        if (description !== task.description) patch({ description });
    };

    const changePriority = (value: (typeof PRIORITIES)[number]["value"]) => {
        setPriority(value);
        patch({ priority: value });
    };

    const changeDueDate = (value: string) => {
        setDueDate(value);
        patch({ dueDate: value || null });
    };

    const toggleLabel = async (labelId: string) => {
        setSaveState("saving");
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
        setSaveState("saved");
        if (savedTimeout.current) clearTimeout(savedTimeout.current);
        savedTimeout.current = setTimeout(() => setSaveState("idle"), 1500);
        router.refresh();
    };

    return (
        <Modal open={open} onClose={onClose} title="Task details">
            <div className="mb-3 flex h-4 items-center justify-end">
                {saveState === "saving" && (
                    <span className="text-xs text-text-secondary">Saving...</span>
                )}
                {saveState === "saved" && (
                    <span className="flex items-center gap-1 text-xs text-success">
                        <Check size={12} /> Saved
                    </span>
                )}
            </div>

            <div className="space-y-6">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-lg font-semibold text-text-primary outline-none focus:border-primary"
                />

                <div>
                    <label className="block text-sm font-medium text-text-primary">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={saveDescription}
                        rows={4}
                        placeholder="Add more detail..."
                        className="mt-2 w-full resize-none rounded-[10px] border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-disabled focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary">
                        Priority
                    </label>
                    <div className="mt-2 flex gap-2">
                        {PRIORITIES.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => changePriority(p.value)}
                                className="flex items-center gap-1.5 rounded-[10px] border px-3 py-2 text-sm font-medium transition-colors"
                                style={{
                                    borderColor: priority === p.value ? p.color : "var(--color-border)",
                                    color: priority === p.value ? p.color : "var(--color-text-secondary)",
                                }}
                            >
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: p.color }}
                                />
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-text-primary"
                    >
                        Due date
                    </label>
                    <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => changeDueDate(e.target.value)}
                        className="mt-2 w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-primary">Labels</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {boardLabels.length === 0 && (
                            <p className="text-sm text-text-secondary">
                                No labels on this board yet.
                            </p>
                        )}
                        {boardLabels.map((label) => {
                            const active = assignedIds.has(label.id);
                            return (
                                <button
                                    key={label.id}
                                    onClick={() => toggleLabel(label.id)}
                                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-opacity"
                                    style={{
                                        borderColor: label.color,
                                        backgroundColor: active ? label.color : "transparent",
                                        color: active ? "white" : label.color,
                                    }}
                                >
                                    {label.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    );
}