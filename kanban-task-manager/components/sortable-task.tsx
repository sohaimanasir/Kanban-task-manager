"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Label } from "@/app/generated/prisma/client";
import type { TaskWithLabels } from "@/lib/types";
import { TaskCard } from "@/components/task-card";

export function SortableTask({
    task,
    boardLabels,
}: {
    task: TaskWithLabels;
    boardLabels: Label[];
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: task.id, data: { type: "task", columnId: task.columnId } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard task={task} boardLabels={boardLabels} />
        </div>
    );
}