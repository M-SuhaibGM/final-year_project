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
            completionStatus,
            tabSwitches,     // Added from frontend
            securityFlags    // Added from frontend (Nested Object)
        } = body;

        const result = await prisma.candidateDetails.create({
            data: {
                interviewId,
                userName,
                userEmail,
                feedback,
                exitReason,
                progressAtExit,
                completionStatus,
                tabSwitches: Number(tabSwitches) || 0, // Ensures it's stored as an integer
                securityFlags,                         // Pass directly as an object (Prisma Json type)
            },
        });

        console.log("Saved Feedback with Security Metrics:", result);
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Database Save Error:", error); // Helpful for debugging
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}