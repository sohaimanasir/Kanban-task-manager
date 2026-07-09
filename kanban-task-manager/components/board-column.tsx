"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column, Task } from "@/app/generated/prisma/client";
import { TaskCard } from "@/components/task-card";
import { CreateTaskButton } from "@/components/create-task-button";

type ColumnWithTasks = Column & { tasks: Task[] };

export function BoardColumn({
    column,
    dragHandle,
}: {
    column: ColumnWithTasks;
    dragHandle?: React.ReactNode;
}) {
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(column.title);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tasks, setTasks] = useState(column.tasks);

    // Keep local order in sync when the server sends fresh data
    // (e.g. after a task is created/deleted elsewhere). Adjusting state
    // during render (rather than in an effect) avoids an extra
    // render pass — see https://react.dev/learn/you-might-not-need-an-effect
    const [prevColumnTasks, setPrevColumnTasks] = useState(column.tasks);
    if (column.tasks !== prevColumnTasks) {
        setPrevColumnTasks(column.tasks);
        setTasks(column.tasks);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 4 },
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = tasks.findIndex((t) => t.id === active.id);
        const newIndex = tasks.findIndex((t) => t.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const reordered = arrayMove(tasks, oldIndex, newIndex);
        setTasks(reordered); // optimistic update

        try {
            const res = await fetch(`/api/columns/${column.id}/tasks`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskIds: reordered.map((t) => t.id) }),
            });
            if (!res.ok) throw new Error("Reorder failed");
            router.refresh();
        } catch {
            setTasks(tasks); // revert on failure
        }
    };

    const saveTitle = async () => {
        setEditing(false);
        if (title.trim() === "" || title === column.title) {
            setTitle(column.title);
            return;
        }
        await fetch(`/api/columns/${column.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        router.refresh();
    };

    const deleteColumn = async () => {
        if (!confirm(`Delete "${column.title}" and all its tasks?`)) return;
        await fetch(`/api/columns/${column.id}`, { method: "DELETE" });
        router.refresh();
    };

    return (
        <div className="flex w-72 flex-shrink-0 flex-col rounded-[12px] bg-background-secondary p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {dragHandle}
                    {editing ? (
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={saveTitle}
                            onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                            className="w-full rounded-[8px] border border-primary bg-surface px-2 py-1 text-sm font-semibold text-text-primary outline-none"
                        />
                    ) : (
                        <h2
                            onClick={() => setEditing(true)}
                            className="cursor-text font-semibold text-text-primary"
                        >
                            {column.title}
                        </h2>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="text-text-secondary transition-colors hover:text-text-primary"
                        aria-label="Column options"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-6 z-10 w-36 rounded-[10px] border border-border bg-background-secondary p-1 shadow-lg">
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    setEditing(true);
                                }}
                                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-text-primary hover:bg-surface"
                            >
                                <Pencil size={14} /> Rename
                            </button>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    deleteColumn();
                                }}
                                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-error hover:bg-surface"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-1 text-xs text-text-secondary">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </p>

            <div className="mt-4 flex flex-1 flex-col gap-2">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </DndContext>
                <CreateTaskButton columnId={column.id} />
            </div>
        </div>
    );
}