import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;

    const task = await prisma.task.findFirst({
        where: { id: taskId, column: { board: { userId: session.user.id } } },
    });
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const activity = await prisma.activity.findMany({
        where: { taskId },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    return NextResponse.json(activity);
}