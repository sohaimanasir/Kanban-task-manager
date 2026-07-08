import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createColumnSchema } from "@/lib/validations/column";

export async function POST(
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
    const parsed = createColumnSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const columnCount = await prisma.column.count({ where: { boardId } });

    const column = await prisma.column.create({
        data: {
            title: parsed.data.title,
            boardId,
            position: columnCount,
        },
    });

    return NextResponse.json(column, { status: 201 });
}