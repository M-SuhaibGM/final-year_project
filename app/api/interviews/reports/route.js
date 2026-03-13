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
      include: {
        candidates: true, // This fetches all candidate reports for each interview
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Fetch Reports Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}