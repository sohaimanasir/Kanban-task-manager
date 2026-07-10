import type { Task, Column, Label, TaskLabel } from "@/app/generated/prisma/client";

export type TaskWithLabels = Task & {
    taskLabels: (TaskLabel & { label: Label })[];
};

export type ColumnWithTasks = Column & {
    tasks: TaskWithLabels[];
};