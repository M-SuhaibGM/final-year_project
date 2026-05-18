import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobPosition, jobDescription, duration, questions, type, interview_link } = body;

    // Use a transaction to ensure both DB operations succeed together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Interview
      const newInterview = await tx.interview.create({
        data: {
          jobPosition,
          jobDescription,
          duration,
          interviewLink: interview_link,
          questions, // JSON field
          type,      // JSON field
          userEmail: session.user.email,
        },
      });

      // 2. Deduct 1 Credit from User
      const updatedUser = await tx.user.update({
        where: { email: session.user.email },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      // Check if user has enough credits (optional safety)
      if (updatedUser.credits < 0) {
        throw new Error("Insufficient credits");
      }

      return newInterview;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const interviews = await prisma.interview.findMany({
    where: { userEmail: session.user.email },
    select: { id: true, jobPosition: true, interviewLink: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(interviews);
}