"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Label } from "@/app/generated/prisma/client";

export type TaskFilters = {
    priorities: Set<"LOW" | "MEDIUM" | "HIGH">;
    labelIds: Set<string>;
    status: "all" | "active" | "completed";
    dueDate: "all" | "overdue" | "today" | "week";
};

export const EMPTY_FILTERS: TaskFilters = {
    priorities: new Set(),
    labelIds: new Set(),
    status: "all",
    dueDate: "all",
};

const PRIORITY_OPTIONS = [
    { value: "LOW" as const, label: "Low", color: "var(--color-info)" },
    { value: "MEDIUM" as const, label: "Medium", color: "var(--color-warning)" },
    { value: "HIGH" as const, label: "High", color: "var(--color-error)" },
];

const DUE_DATE_OPTIONS = [
    { value: "all" as const, label: "Any time" },
    { value: "overdue" as const, label: "Overdue" },
    { value: "today" as const, label: "Due today" },
    { value: "week" as const, label: "Due this week" },
];

export function BoardFilters({
    boardLabels,
    filters,
    onChange,
}: {
    boardLabels: Label[];
    filters: TaskFilters;
    onChange: (filters: TaskFilters) => void;
}) {
    const [open, setOpen] = useState(false);

    const activeCount =
        filters.priorities.size +
        filters.labelIds.size +
        (filters.status !== "all" ? 1 : 0) +
        (filters.dueDate !== "all" ? 1 : 0);

    const togglePriority = (p: "LOW" | "MEDIUM" | "HIGH") => {
        const next = new Set(filters.priorities);
        if (next.has(p)) {
            next.delete(p);
        } else {
            next.add(p);
        }
        onChange({ ...filters, priorities: next });
    };

    const toggleLabel = (labelId: string) => {
        const next = new Set(filters.labelIds);
        if (next.has(labelId)) {
            next.delete(labelId);
        } else {
            next.add(labelId);
        }
        onChange({ ...filters, labelIds: next });
    };
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-[10px] border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
                <SlidersHorizontal size={16} />
                Filters
                {activeCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {activeCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-11 z-20 w-72 space-y-4 rounded-[12px] border border-border bg-background-secondary p-4 shadow-lg">
                        {activeCount > 0 && (
                            <button
                                onClick={() => onChange(EMPTY_FILTERS)}
                                className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary"
                            >
                                <X size={12} /> Clear all
                            </button>
                        )}

                        <div>
                            <p className="text-xs font-medium text-text-secondary">Status</p>
                            <div className="mt-1.5 flex gap-1.5">
                                {(["all", "active", "completed"] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => onChange({ ...filters, status: s })}
                                        className={`rounded-[8px] border px-2.5 py-1 text-xs capitalize transition-colors ${filters.status === s
                                            ? "border-primary text-primary"
                                            : "border-border text-text-secondary hover:text-text-primary"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-text-secondary">Priority</p>
                            <div className="mt-1.5 flex gap-1.5">
                                {PRIORITY_OPTIONS.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => togglePriority(p.value)}
                                        className="flex items-center gap-1 rounded-[8px] border px-2.5 py-1 text-xs transition-colors"
                                        style={{
                                            borderColor: filters.priorities.has(p.value)
                                                ? p.color
                                                : "var(--color-border)",
                                            color: filters.priorities.has(p.value)
                                                ? p.color
                                                : "var(--color-text-secondary)",
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
                            <p className="text-xs font-medium text-text-secondary">Due date</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {DUE_DATE_OPTIONS.map((d) => (
                                    <button
                                        key={d.value}
                                        onClick={() => onChange({ ...filters, dueDate: d.value })}
                                        className={`rounded-[8px] border px-2.5 py-1 text-xs transition-colors ${filters.dueDate === d.value
                                            ? "border-primary text-primary"
                                            : "border-border text-text-secondary hover:text-text-primary"
                                            }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {boardLabels.length > 0 && (
                            <div>
                                <p className="text-xs font-medium text-text-secondary">Labels</p>
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {boardLabels.map((label) => (
                                        <button
                                            key={label.id}
                                            onClick={() => toggleLabel(label.id)}
                                            className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-opacity"
                                            style={{
                                                borderColor: label.color,
                                                backgroundColor: filters.labelIds.has(label.id)
                                                    ? label.color
                                                    : "transparent",
                                                color: filters.labelIds.has(label.id) ? "white" : label.color,
                                            }}
                                        >
                                            {label.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}