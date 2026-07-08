import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateColumnSchema } from "@/lib/validations/column";

async function getOwnedColumn(columnId: string, userId: string) {
    return prisma.column.findFirst({
        where: {
            id: columnId,
            board: { userId },
        },
    });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ columnId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { columnId } = await params;
    const existing = await getOwnedColumn(columnId, session.user.id);
    if (!existing) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateColumnSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const column = await prisma.column.update({
        where: { id: columnId },
        data: { title: parsed.data.title },
    });

    return NextResponse.json(column);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ columnId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { columnId } = await params;
    const existing = await getOwnedColumn(columnId, session.user.id);
    if (!existing) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    await prisma.column.delete({ where: { id: columnId } });

    return NextResponse.json({ success: true });
}