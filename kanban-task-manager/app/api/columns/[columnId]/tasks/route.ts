import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";

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