import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            interviewId,
            userName,
            userEmail,
            feedback,
            exitReason,
            progressAtExit,
            completionStatus
        } = body;

        const result = await prisma.candidateDetails.create({
            data: {
                interviewId,
                userName,
                userEmail,
                feedback,
                exitReason,        // Dynamic from Frontend
                progressAtExit,    // Dynamic from Frontend
                completionStatus,  // Dynamic from Frontend
            },
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}