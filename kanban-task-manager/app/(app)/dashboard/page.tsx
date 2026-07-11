import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateBoardDialog } from "@/components/create-board-dialog";
import { BoardCard } from "@/components/board-card";

export default async function DashboardPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const name = session?.user.name ?? "there";

    const boards = session
        ? await prisma.board.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        })
        : [];

    return (
        <div className="p-4 lg:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[32px] font-bold text-text-primary">
                        Welcome, {name} 👋
                    </h1>
                    <p className="mt-2 text-text-secondary">
                        {boards.length === 0
                            ? "Let's create your first board."
                            : "Here's what you're working on."}
                    </p>
                </div>
                <CreateBoardDialog />
            </div>

            <div className="mt-8">
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
    );
}