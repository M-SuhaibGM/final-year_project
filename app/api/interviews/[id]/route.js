import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params; // This is the interview_link from the URL
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const interview = await prisma.interview.findFirst({
      where: {
        interviewLink: id,
        userEmail: session.user.email,
      },
      include: {
        candidates: {
          orderBy: {
            createdAt: "desc"
          }
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Fetch Interview Detail Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(Request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const interviewId = params.id;

    // Optional: Ensure the interview belongs to the user before deleting
    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
        userEmail: session.user.email,
      },
    });

    if (!interview) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.interview.delete({
      where: {
        id: interviewId,
      },
    });

    return NextResponse.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("[INTERVIEW_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

