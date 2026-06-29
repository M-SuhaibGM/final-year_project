import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { interviewId, userName, userEmail } = body;

        if (!interviewId || !userEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find existing candidate details for this interview and email
        let candidate = await prisma.candidateDetails.findFirst({
            where: {
                interviewId,
                userEmail,
            },
        });

        // If candidate doesn't exist, initialize details
        if (!candidate) {
            candidate = await prisma.candidateDetails.create({
                data: {
                    interviewId,
                    userName,
                    userEmail,
                    completionStatus: "Incomplete",
                    exitReason: "Started",
                    tabSwitches: 0,
                    securityFlags: {
                        timestamps: [],
                        browser: "",
                        platform: "",
                    }
                },
            });
        }

        return NextResponse.json({
            success: true,
            candidateId: candidate.id,
            tabSwitches: candidate.tabSwitches
        });
    } catch (error) {
        console.error("Initialize Candidate Error:", error);
        return NextResponse.json({ error: "Failed to initialize candidate" }, { status: 500 });
    }
}
