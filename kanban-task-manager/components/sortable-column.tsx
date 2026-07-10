"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Column, Task } from "@/app/generated/prisma/client";
import { BoardColumn } from "@/components/board-column";

type ColumnWithTasks = Column & { tasks: Task[] };

export function SortableColumn({ column }: { column: ColumnWithTasks }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: column.id, data: { type: "column" } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex-shrink-0">
            <BoardColumn
                column={column}
                dragHandle={
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab text-text-secondary hover:text-text-primary active:cursor-grabbing"
                        aria-label="Drag column"
                    >
                        <GripVertical size={16} />
                    </button>
                }
            />
        </div>
    );
}