"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Trash2, Plus } from "lucide-react";
import type { Label } from "@/app/generated/prisma/client";
import { SWATCHES } from "@/lib/colors";
import { Modal } from "@/components/ui/modal";

export function ManageLabelsDialog({
    boardId,
    labels,
}: {
    boardId: string;
    labels: Label[];
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [color, setColor] = useState<string>(SWATCHES[0].value);
    const [submitting, setSubmitting] = useState(false);

    const createLabel = async () => {
        if (name.trim() === "") return;
        setSubmitting(true);
        await fetch(`/api/boards/${boardId}/labels`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, color }),
        });
        setSubmitting(false);
        setName("");
        router.refresh();
    };

    const deleteLabel = async (labelId: string) => {
        await fetch(`/api/labels/${labelId}`, { method: "DELETE" });
        router.refresh();
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-[10px] border border-border px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
                <Tag size={16} />
                Labels
            </button>

            <Modal open={open} onClose={() => setOpen(false)} title="Manage labels">
                <div className="space-y-2">
                    {labels.length === 0 && (
                        <p className="text-sm text-text-secondary">No labels yet.</p>
                    )}
                    {labels.map((label) => (
                        <div
                            key={label.id}
                            className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: label.color }}
                                />
                                <span className="text-sm text-text-primary">{label.name}</span>
                            </div>
                            <button
                                onClick={() => deleteLabel(label.id)}
                                className="text-text-disabled transition-colors hover:text-error"
                                aria-label={`Delete ${label.name}`}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t border-border pt-4">
                    <label className="block text-sm font-medium text-text-primary">
                        New label
                    </label>
                    <div className="mt-2 flex gap-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && createLabel()}
                            placeholder="Label name"
                            className="flex-1 rounded-[10px] border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-disabled focus:border-primary"
                        />
                        <button
                            onClick={createLabel}
                            disabled={submitting}
                            className="rounded-[10px] bg-primary px-3 py-2 text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                            aria-label="Add label"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="mt-2 flex gap-2">
                        {SWATCHES.map((swatch) => (
                            <button
                                key={swatch.value}
                                onClick={() => setColor(swatch.value)}
                                className={`h-6 w-6 rounded-full ${color === swatch.value
                                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background-secondary"
                                    : ""
                                    }`}
                                style={{ backgroundColor: swatch.value }}
                                aria-label={swatch.name}
                            />
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
}