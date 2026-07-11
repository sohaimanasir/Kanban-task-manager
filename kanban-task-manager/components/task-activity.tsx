"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";

type ActivityEntry = { id: string; action: string; createdAt: string };

function timeAgo(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function TaskActivity({ taskId, open }: { taskId: string; open: boolean }) {
    const [entries, setEntries] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;

        async function loadActivity() {
            setLoading(true);
            const res = await fetch(`/api/tasks/${taskId}/activity`);
            const data = await res.json();
            if (!cancelled) {
                setEntries(data);
                setLoading(false);
            }
        }

        loadActivity();

        return () => {
            cancelled = true;
        };
    }, [taskId, open]);

    if (!open) return null;

    return (
        <div>
            <div className="flex items-center gap-2">
                <History size={14} className="text-text-secondary" />
                <label className="block text-sm font-medium text-text-primary">Activity</label>
            </div>
            <div className="mt-2 space-y-1.5">
                {loading && <p className="text-sm text-text-secondary">Loading...</p>}
                {!loading && entries.length === 0 && (
                    <p className="text-sm text-text-secondary">No activity yet.</p>
                )}
                {entries.map((entry) => (
                    <p key={entry.id} className="text-xs text-text-secondary">
                        {entry.action} · {timeAgo(entry.createdAt)}
                    </p>
                ))}
            </div>
        </div>
    );
}