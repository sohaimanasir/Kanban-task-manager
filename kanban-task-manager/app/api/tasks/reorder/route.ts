import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reorderSchema = z.object({
    updates: z
        .array(
            z.object({
                id: z.string(),
                columnId: z.string(),
                position: z.number().int().min(0),
            })
        )
        .min(1),
});

export async function PATCH(request: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const taskIds = parsed.data.updates.map((u) => u.id);
    const columnIds = [...new Set(parsed.data.updates.map((u) => u.columnId))];

    const [ownedTasks, ownedColumns] = await Promise.all([
        prisma.task.findMany({
            where: { id: { in: taskIds }, column: { board: { userId: session.user.id } } },
            select: { id: true },
        }),
        prisma.column.findMany({
            where: { id: { in: columnIds }, board: { userId: session.user.id } },
            select: { id: true },
        }),
    ]);

    if (
        ownedTasks.length !== taskIds.length ||
        ownedColumns.length !== columnIds.length
    ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction(
        parsed.data.updates.map((u) =>
            prisma.task.update({
                where: { id: u.id },
                data: { columnId: u.columnId, position: u.position },
            })
        )
    );

    return NextResponse.json({ success: true });
}