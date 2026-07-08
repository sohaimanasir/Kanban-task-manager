"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CreateColumnButton({ boardId }: { boardId: string }) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submit = async () => {
        if (title.trim() === "") {
            setAdding(false);
            return;
        }
        setSubmitting(true);
        await fetch(`/api/boards/${boardId}/columns`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        setSubmitting(false);
        setTitle("");
        setAdding(false);
        router.refresh();
    };

    if (adding) {
        return (
            <div className="w-72 flex-shrink-0 rounded-[12px] bg-background-secondary p-4">
                <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={submit}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="Column name"
                    disabled={submitting}
                    className="w-full rounded-[8px] border border-primary bg-surface px-2 py-1.5 text-sm text-text-primary outline-none placeholder:text-text-disabled"
                />
            </div>
        );
    }

    return (
        <button
            onClick={() => setAdding(true)}
            className="flex h-12 w-72 flex-shrink-0 items-center justify-center gap-2 rounded-[12px] border border-dashed border-border text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
            <Plus size={18} />
            Add column
        </button>
    );
}