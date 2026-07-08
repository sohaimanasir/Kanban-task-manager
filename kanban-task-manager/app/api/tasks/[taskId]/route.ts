import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations/task";

async function getOwnedTask(taskId: string, userId: string) {
    return prisma.task.findFirst({
        where: {
            id: taskId,
            column: { board: { userId } },
        },
    });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    const existing = await getOwnedTask(taskId, session.user.id);
    if (!existing) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const task = await prisma.task.update({
        where: { id: taskId },
        data: parsed.data,
    });

    return NextResponse.json(task);
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
    const existing = await getOwnedTask(taskId, session.user.id);
    if (!existing) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    return NextResponse.json({ success: true });
}