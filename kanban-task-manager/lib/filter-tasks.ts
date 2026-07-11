import type { TaskWithLabels } from "@/lib/types";
import type { TaskFilters } from "@/components/board-filters";

export function taskMatchesFilters(task: TaskWithLabels, filters: TaskFilters): boolean {
    if (filters.status === "active" && task.isCompleted) return false;
    if (filters.status === "completed" && !task.isCompleted) return false;

    if (filters.priorities.size > 0 && !filters.priorities.has(task.priority)) {
        return false;
    }

    if (filters.labelIds.size > 0) {
        const taskLabelIds = new Set(task.taskLabels.map((tl) => tl.labelId));
        const hasMatch = [...filters.labelIds].some((id) => taskLabelIds.has(id));
        if (!hasMatch) return false;
    }

    if (filters.dueDate !== "all") {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);
        const endOfWeek = new Date(startOfToday);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        if (filters.dueDate === "overdue" && due >= startOfToday) return false;
        if (filters.dueDate === "today" && (due < startOfToday || due >= endOfToday)) {
            return false;
        }
        if (filters.dueDate === "week" && (due < startOfToday || due >= endOfWeek)) {
            return false;
        }
    }

    return true;
}