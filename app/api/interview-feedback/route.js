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

        // Check if candidate details already exist for this email and interview link
        const existingCandidate = await prisma.candidateDetails.findFirst({
            where: {
                interviewId,
                userEmail,
            },
        });

        let result;
        if (existingCandidate) {
            result = await prisma.candidateDetails.update({
                where: { id: existingCandidate.id },
                data: {
                    feedback,
                    exitReason,
                    progressAtExit,
                    completionStatus,
                    tabSwitches: Number(tabSwitches) !== undefined ? Number(tabSwitches) : existingCandidate.tabSwitches,
                    securityFlags: securityFlags || existingCandidate.securityFlags,
                },
            });
        } else {
            result = await prisma.candidateDetails.create({
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
        }
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Database Save Error:", error); // Helpful for debugging
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}