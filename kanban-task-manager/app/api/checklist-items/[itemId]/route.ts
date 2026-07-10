import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateChecklistItemSchema } from "@/lib/validations/checklist";

async function getOwnedItem(itemId: string, userId: string) {
    return prisma.checklistItem.findFirst({
        where: {
            id: itemId,
            checklist: { task: { column: { board: { userId } } } },
        },
    });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const existing = await getOwnedItem(itemId, session.user.id);
    if (!existing) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateChecklistItemSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const item = await prisma.checklistItem.update({
        where: { id: itemId },
        data: parsed.data,
    });

    return NextResponse.json(item);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const existing = await getOwnedItem(itemId, session.user.id);
    if (!existing) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.checklistItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
}