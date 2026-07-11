import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateBoardDialog } from "@/components/create-board-dialog";
import { BoardCard } from "@/components/board-card";
import { DashboardTaskList } from "@/components/dashboard-task-list";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const name = session?.user.name ?? "there";

    if (!session) {
        return null;
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const [boards, overdueTasks, todayTasks] = await Promise.all([
        prisma.board.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        }),
        prisma.task.findMany({
            where: {
                column: { board: { userId: session.user.id } },
                isArchived: false,
                isCompleted: false,
                dueDate: { lt: startOfToday },
            },
            include: { column: { select: { board: { select: { id: true, title: true } } } } },
            orderBy: { dueDate: "asc" },
            take: 10,
        }),
        prisma.task.findMany({
            where: {
                column: { board: { userId: session.user.id } },
                isArchived: false,
                isCompleted: false,
                dueDate: { gte: startOfToday, lt: endOfToday },
            },
            include: { column: { select: { board: { select: { id: true, title: true } } } } },
            orderBy: { dueDate: "asc" },
            take: 10,
        }),
    ]);

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-[32px] font-bold text-text-primary">
                        Welcome, {name} 👋
                    </h1>
                    <p className="mt-2 text-text-secondary">
                        {boards.length === 0
                            ? "Let's create your first board."
                            : "Here's what needs your attention."}
                    </p>
                </div>
                <CreateBoardDialog />
            </div>

            {(overdueTasks.length > 0 || todayTasks.length > 0) && (
                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {overdueTasks.length > 0 && (
                        <DashboardTaskList
                            title="Overdue"
                            tasks={overdueTasks}
                            accentColor="var(--color-error)"
                        />
                    )}
                    {todayTasks.length > 0 && (
                        <DashboardTaskList
                            title="Due today"
                            tasks={todayTasks}
                            accentColor="var(--color-primary)"
                        />
                    )}
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-text-primary">Your boards</h2>
                <div className="mt-4">
                    {boards.length === 0 ? (
                        <div className="rounded-[12px] border border-dashed border-border p-12 text-center">
                            <p className="font-medium text-text-primary">No boards yet.</p>
                            <p className="mt-1 text-sm text-text-secondary">
                                Create your first board and start organizing your work.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {boards.map((board) => (
                                <BoardCard key={board.id} board={board} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}