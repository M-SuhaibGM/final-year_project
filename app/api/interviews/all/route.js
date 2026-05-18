import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const interviews = await prisma.interview.findMany({
            where: {
                userEmail: session.user.email,
            },
            select: {
                id: true,
                jobPosition: true,
                duration: true,
                interviewLink: true,
                createdAt: true,
                questions: true,
                // Including a count of candidates who took the interview
                _count: {
                    select: { candidates: true }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(interviews);
    } catch (error) {
        console.error("Fetch Interviews Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}