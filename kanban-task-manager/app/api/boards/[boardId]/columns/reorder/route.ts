import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reorderSchema = z.object({
    columnIds: z.array(z.string()).min(1),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ boardId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { boardId } = await params;

    const board = await prisma.board.findFirst({
        where: { id: boardId, userId: session.user.id },
    });
    if (!board) {
        return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await prisma.$transaction(
        parsed.data.columnIds.map((id, index) =>
            prisma.column.update({
                where: { id, boardId },
                data: { position: index },
            })
        )
    );

    return NextResponse.json({ success: true });
}