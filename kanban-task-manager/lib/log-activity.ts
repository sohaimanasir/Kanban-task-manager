import { prisma } from "@/lib/prisma";

export async function logActivity(taskId: string, action: string) {
    await prisma.activity.create({
        data: { taskId, action },
    });
}