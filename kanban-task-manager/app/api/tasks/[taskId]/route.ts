import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations/task";
import { logActivity } from "@/lib/log-activity";

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
    const { dueDate, ...rest } = parsed.data;

    const task = await prisma.task.update({
        where: { id: taskId },
        data: {
            ...rest,
            ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        },
    });

    if (parsed.data.isCompleted !== undefined) {
        await logActivity(taskId, parsed.data.isCompleted ? "marked this complete" : "marked this incomplete");
    }
    if (parsed.data.priority !== undefined) {
        await logActivity(taskId, `changed priority to ${parsed.data.priority}`);
    }
    if (dueDate !== undefined) {
        await logActivity(taskId, dueDate ? "set a due date" : "removed the due date");
    }

    return NextResponse.json(task);

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