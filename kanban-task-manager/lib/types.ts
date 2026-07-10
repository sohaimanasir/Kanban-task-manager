import type {
    Task,
    Column,
    Label,
    TaskLabel,
    Checklist,
    ChecklistItem,
} from "@/app/generated/prisma/client";

export type TaskWithLabels = Task & {
    taskLabels: (TaskLabel & { label: Label })[];
    checklist: (Checklist & { items: ChecklistItem[] }) | null;
};

export type ColumnWithTasks = Column & {
    tasks: TaskWithLabels[];
};