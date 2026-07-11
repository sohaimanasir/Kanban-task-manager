import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";

    if (q.length === 0) {
        return NextResponse.json({ boards: [], tasks: [] });
    }

    const [boards, tasks] = await Promise.all([
        prisma.board.findMany({
            where: {
                userId: session.user.id,
                title: { contains: q, mode: "insensitive" },
            },
            take: 5,
        }),
        prisma.task.findMany({
            where: {
                column: { board: { userId: session.user.id } },
                isArchived: false,
                title: { contains: q, mode: "insensitive" },
            },
            include: {
                column: { select: { boardId: true, board: { select: { title: true } } } },
            },
            take: 8,
        }),
    ]);

    return NextResponse.json({ boards, tasks });
}