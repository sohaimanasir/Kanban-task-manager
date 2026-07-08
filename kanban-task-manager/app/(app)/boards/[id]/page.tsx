import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BoardColumn } from "@/components/board-column";
import { CreateColumnButton } from "@/components/create-column-button";

export default async function BoardPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        notFound();
    }

    const board = await prisma.board.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
        include: {
            columns: {
                orderBy: { position: "asc" },
                include: {
                    tasks: {
                        where: { isArchived: false },
                        orderBy: { position: "asc" },
                    },
                },
            },
        },
    });

    if (!board) {
        notFound();
    }

    return (
        <div className="flex h-screen flex-col p-8">
            <div className="flex items-center gap-3">
                <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: board.color }}
                />
                <h1 className="text-2xl font-bold text-text-primary">{board.title}</h1>
            </div>
            {board.description && (
                <p className="mt-1 text-text-secondary">{board.description}</p>
            )}

            <div className="mt-6 flex flex-1 gap-4 overflow-x-auto pb-4">
                {board.columns.map((column) => (
                    <BoardColumn key={column.id} column={column} />
                ))}
                <CreateColumnButton boardId={board.id} />
            </div>
        </div>
    );
}