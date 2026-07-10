import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createChecklistItemSchema } from "@/lib/validations/checklist";

async function getOwnedTask(taskId: string, userId: string) {
    return prisma.task.findFirst({
        where: { id: taskId, column: { board: { userId } } },
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
    const parsed = createChecklistItemSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const checklist = await prisma.checklist.upsert({
        where: { taskId },
        create: { taskId },
        update: {},
    });

    const itemCount = await prisma.checklistItem.count({
        where: { checklistId: checklist.id },
    });

    const item = await prisma.checklistItem.create({
        data: {
            title: parsed.data.title,
            checklistId: checklist.id,
            position: itemCount,
        },
    });

    return NextResponse.json(item, { status: 201 });
}