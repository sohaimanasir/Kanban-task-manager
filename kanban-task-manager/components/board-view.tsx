"use client";

import { useState } from "react";
import {
    DndContext,
    DragEndEvent,
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

    if (initialColumns !== prevInitialColumns) {
        setPrevInitialColumns(initialColumns);
        setColumns(initialColumns);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

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
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
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
        </DndContext>
    );
}