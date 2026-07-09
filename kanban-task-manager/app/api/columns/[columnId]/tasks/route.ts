import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema, reorderTasksSchema } from "@/lib/validations/task";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ columnId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { columnId } = await params;

    const column = await prisma.column.findFirst({
        where: { id: columnId, board: { userId: session.user.id } },
    });

    if (!column) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const taskCount = await prisma.task.count({ where: { columnId } });

    const task = await prisma.task.create({
        data: {
            title: parsed.data.title,
            description: "",
            columnId,
            position: taskCount,
        },
    });

    return NextResponse.json(task, { status: 201 });
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

    const column = await prisma.column.findFirst({
        where: { id: columnId, board: { userId: session.user.id } },
    });

    if (!column) {
        return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = reorderTasksSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { taskIds } = parsed.data;

    // Make sure the submitted ids are exactly the tasks currently in this column
    const existingTasks = await prisma.task.findMany({
        where: { columnId },
        select: { id: true },
    });
    const existingIds = new Set(existingTasks.map((t) => t.id));
    const submittedIds = new Set(taskIds);

    const isValidSet =
        existingIds.size === submittedIds.size &&
        [...existingIds].every((id) => submittedIds.has(id));

    if (!isValidSet) {
        return NextResponse.json(
            { error: "taskIds must match the tasks currently in this column" },
            { status: 400 }
        );
    }

    await prisma.$transaction(
        taskIds.map((id, index) =>
            prisma.task.update({
                where: { id },
                data: { position: index },
            })
        )
    );

    return NextResponse.json({ success: true });
}