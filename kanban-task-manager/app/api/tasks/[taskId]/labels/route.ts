import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ labelId: z.string() });

async function getOwnedTask(taskId: string, userId: string) {
    return prisma.task.findFirst({
        where: { id: taskId, column: { board: { userId } } },
        include: { column: { select: { boardId: true } } },
    });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const task = await getOwnedTask(taskId, session.user.id);
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const label = await prisma.label.findFirst({
        where: { id: parsed.data.labelId, boardId: task.column.boardId },
    });
    if (!label) {
        return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    await prisma.taskLabel.upsert({
        where: { taskId_labelId: { taskId, labelId: label.id } },
        create: { taskId, labelId: label.id },
        update: {},
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const task = await getOwnedTask(taskId, session.user.id);
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get("labelId");
    if (!labelId) {
        return NextResponse.json({ error: "labelId required" }, { status: 400 });
    }

    await prisma.taskLabel.deleteMany({ where: { taskId, labelId } });

    return NextResponse.json({ success: true });
}