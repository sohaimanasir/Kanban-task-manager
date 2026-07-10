"use client";

import { useState } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column, Task } from "@/app/generated/prisma/client";
import { SortableColumn } from "@/components/sortable-column";
import { CreateColumnButton } from "@/components/create-column-button";
import { TaskCard } from "@/components/task-card";

type ColumnWithTasks = Column & { tasks: Task[] };

export function BoardView({
    boardId,
    initialColumns,
}: {
    boardId: string;
    initialColumns: ColumnWithTasks[];
}) {
    const [columns, setColumns] = useState(initialColumns);
    const [prevInitialColumns, setPrevInitialColumns] = useState(initialColumns);
    const [activeType, setActiveType] = useState<"column" | "task" | null>(null);
    const [activeColumn, setActiveColumn] = useState<ColumnWithTasks | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    if (initialColumns !== prevInitialColumns) {
        setPrevInitialColumns(initialColumns);
        setColumns(initialColumns);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    function findColumnId(id: string): string | undefined {
        if (columns.some((c) => c.id === id)) return id;
        if (id.startsWith("col-")) return id.replace("col-", "");
        for (const col of columns) {
            if (col.tasks.some((t) => t.id === id)) return col.id;
        }
        return undefined;
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type as "column" | "task" | undefined;
        setActiveType(type ?? null);

        if (type === "column") {
            setActiveColumn(columns.find((c) => c.id === active.id) ?? null);
        } else if (type === "task") {
            const colId = findColumnId(active.id as string);
            const col = columns.find((c) => c.id === colId);
            setActiveTask(col?.tasks.find((t) => t.id === active.id) ?? null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.data.current?.type !== "task") return;

        const activeColumnId = findColumnId(active.id as string);
        const overColumnId = findColumnId(over.id as string);
        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

        setColumns((prev) => {
            const activeCol = prev.find((c) => c.id === activeColumnId);
            const overCol = prev.find((c) => c.id === overColumnId);
            if (!activeCol || !overCol) return prev;

            const activeTaskItem = activeCol.tasks.find((t) => t.id === active.id);
            if (!activeTaskItem) return prev;

            const overTaskIndex = overCol.tasks.findIndex((t) => t.id === over.id);
            const insertIndex = overTaskIndex >= 0 ? overTaskIndex : overCol.tasks.length;

            return prev.map((col) => {
                if (col.id === activeColumnId) {
                    return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) };
                }
                if (col.id === overColumnId) {
                    const newTasks = [...col.tasks];
                    newTasks.splice(insertIndex, 0, { ...activeTaskItem, columnId: overColumnId });
                    return { ...col, tasks: newTasks };
                }
                return col;
            });
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveType(null);
        setActiveColumn(null);
        setActiveTask(null);
        if (!over) return;

        if (active.data.current?.type === "column") {
            if (active.id === over.id) return;
            const oldIndex = columns.findIndex((c) => c.id === active.id);
            const newIndex = columns.findIndex((c) => c.id === over.id);
            if (oldIndex === -1 || newIndex === -1) return;

            const reordered = arrayMove(columns, oldIndex, newIndex);
            setColumns(reordered);

            await fetch(`/api/boards/${boardId}/columns/reorder`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ columnIds: reordered.map((c) => c.id) }),
            });
            return;
        }

        if (active.data.current?.type === "task") {
            const activeColumnId = findColumnId(active.id as string);
            const overColumnId = findColumnId(over.id as string);
            if (!activeColumnId || !overColumnId) return;

            let finalColumns = columns;

            if (activeColumnId === overColumnId) {
                const col = columns.find((c) => c.id === activeColumnId)!;
                const oldIndex = col.tasks.findIndex((t) => t.id === active.id);
                const newIndex = col.tasks.findIndex((t) => t.id === over.id);
                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    const reorderedTasks = arrayMove(col.tasks, oldIndex, newIndex);
                    finalColumns = columns.map((c) =>
                        c.id === activeColumnId ? { ...c, tasks: reorderedTasks } : c
                    );
                    setColumns(finalColumns);
                }
            }

            const affectedColumnIds = Array.from(new Set([activeColumnId, overColumnId]));
            const updates = affectedColumnIds.flatMap((colId) => {
                const col = finalColumns.find((c) => c.id === colId);
                if (!col) return [];
                return col.tasks.map((t, index) => ({
                    id: t.id,
                    columnId: colId,
                    position: index,
                }));
            });

            await fetch(`/api/tasks/reorder`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updates }),
            });
        }
    };

    return (
        <DndContext
            id="board-dnd-context"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="mt-6 flex flex-1 gap-4 overflow-x-auto pb-4">
                <SortableContext
                    items={columns.map((c) => c.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {columns.map((column) => (
                        <SortableColumn key={column.id} column={column} />
                    ))}
                </SortableContext>
                <CreateColumnButton boardId={boardId} />
            </div>

            <DragOverlay>
                {activeType === "task" && activeTask ? (
                    <div className="w-64 rotate-2 opacity-90">
                        <TaskCard task={activeTask} />
                    </div>
                ) : null}
                {activeType === "column" && activeColumn ? (
                    <div className="w-72 rotate-1 rounded-[12px] bg-background-secondary p-4 opacity-90 shadow-xl">
                        <h2 className="font-semibold text-text-primary">{activeColumn.title}</h2>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}