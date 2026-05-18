// app/actions/user.js
"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserCredits() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }, // Only fetch what you need
    });

    return user?.credits || 0;
}

export async function deleteInterview(id) {
    await prisma.interview.delete({ where: { id } });
    redirect('/dashboard');
}