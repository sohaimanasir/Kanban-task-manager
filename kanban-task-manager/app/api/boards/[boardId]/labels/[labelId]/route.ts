import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ labelId: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { labelId } = await params;

    const label = await prisma.label.findFirst({
        where: { id: labelId, board: { userId: session.user.id } },
    });
    if (!label) {
        return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    await prisma.label.delete({ where: { id: labelId } });

    return NextResponse.json({ success: true });
}