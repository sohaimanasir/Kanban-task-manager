"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CreateTaskButton({ columnId }: { columnId: string }) {
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
        await fetch(`/api/columns/${columnId}/tasks`, {
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
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={submit}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Task title"
                disabled={submitting}
                className="w-full rounded-[10px] border border-primary bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-disabled"
            />
        );
    }

    return (
        <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
        >
            <Plus size={16} />
            Add task
        </button>
    );
}