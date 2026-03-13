import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // This is the interview_link

    const interview = await prisma.interview.findUnique({
      where: {
        interviewLink: id,
      },
      select: {
        jobPosition: true,
        jobDescription: true,
        duration: true,
        type: true,
        questions: true, 
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}