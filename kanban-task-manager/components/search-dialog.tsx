"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutGrid, FileText } from "lucide-react";
import type { Board, Task } from "@/app/generated/prisma/client";

type TaskResult = Task & { column: { boardId: string; board: { title: string } } };

export function SearchDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [boards, setBoards] = useState<Board[]>([]);
    const [tasks, setTasks] = useState<TaskResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    useEffect(() => {
        const onGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(true);
            }
        };
        document.addEventListener("keydown", onGlobalKeyDown);
        return () => document.removeEventListener("keydown", onGlobalKeyDown);
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            if (query.trim() === "") {
                setBoards([]);
                setTasks([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setBoards(data.boards);
            setTasks(data.tasks);
            setLoading(false);
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);
    const goToBoard = (boardId: string) => {
        setOpen(false);
        setQuery("");
        router.push(`/boards/${boardId}`);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-[10px] border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
                <Search size={16} />
                Search
                <kbd className="ml-auto text-xs text-text-disabled">⌘K</kbd>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24">
            <div className="w-full max-w-lg rounded-[16px] border border-border bg-background-secondary p-2 shadow-xl">
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                    <Search size={16} className="text-text-secondary" />
                    <input
                        ref={inputRef}
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search boards and tasks..."
                        className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-disabled"
                    />
                    <button
                        onClick={() => setOpen(false)}
                        className="text-xs text-text-disabled hover:text-text-primary"
                    >
                        Esc
                    </button>
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                    {loading && (
                        <p className="px-2 py-3 text-sm text-text-secondary">Searching...</p>
                    )}

                    {!loading && query.trim() !== "" && boards.length === 0 && tasks.length === 0 && (
                        <p className="px-2 py-3 text-sm text-text-secondary">No results found.</p>
                    )}

                    {boards.length > 0 && (
                        <div>
                            <p className="px-2 py-1 text-xs font-medium text-text-secondary">Boards</p>
                            {boards.map((board) => (
                                <button
                                    key={board.id}
                                    onClick={() => goToBoard(board.id)}
                                    className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left text-sm text-text-primary hover:bg-surface"
                                >
                                    <LayoutGrid size={14} style={{ color: board.color }} />
                                    {board.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {tasks.length > 0 && (
                        <div className="mt-2">
                            <p className="px-2 py-1 text-xs font-medium text-text-secondary">Tasks</p>
                            {tasks.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => goToBoard(task.column.boardId)}
                                    className="flex w-full items-center gap-2 rounded-[10px] px-2 py-2 text-left text-sm hover:bg-surface"
                                >
                                    <FileText size={14} className="shrink-0 text-text-secondary" />
                                    <span className="flex-1 truncate text-text-primary">{task.title}</span>
                                    <span className="shrink-0 text-xs text-text-disabled">
                                        {task.column.board.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}