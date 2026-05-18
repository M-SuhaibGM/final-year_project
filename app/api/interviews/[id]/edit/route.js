import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const interview = await prisma.interview.findUnique({
            where: { id },
        });

        if (!interview) {
            return NextResponse.json({ message: "Interview record profile not found" }, { status: 404 });
        }

        return NextResponse.json(interview, { status: 200 });
    } catch (error) {
        console.error("API GET Error:", error);
        return NextResponse.json({ message: "Internal server payload error" }, { status: 500 });
    }
}

/**
 * PUT: Mutate details field properties
 */
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { jobPosition, duration, jobDescription } = body;

        // Optional validation check block
        if (!jobPosition || !duration || !jobDescription) {
            return NextResponse.json({ message: "Missing required form fields" }, { status: 400 });
        }

        // Mutate state structure inside DB context targets
        const updatedInterview = await prisma.interview.update({
            where: { id },
            data: {
                jobPosition,
                duration,
                jobDescription,
            },
        });

        return NextResponse.json(updatedInterview, { status: 200 });
    } catch (error) {
        console.error("API PUT Error:", error);
        return NextResponse.json({ message: "Could not alter profile entry record" }, { status: 500 });
    }
}