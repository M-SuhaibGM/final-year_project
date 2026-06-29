import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { candidateId, browser, platform } = body;

        if (!candidateId) {
            return NextResponse.json({ error: "Missing candidateId" }, { status: 400 });
        }

        // Fetch current snapshot directly to capture existing timestamps safely
        const candidate = await prisma.candidateDetails.findUnique({
            where: { id: candidateId },
        });

        if (!candidate) {
            return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
        }

        const currentFlags = candidate.securityFlags || {};
        const currentTimestamps = currentFlags.timestamps || [];
        const updatedTimestamps = [...currentTimestamps, new Date().toISOString()];

        const updated = await prisma.candidateDetails.update({
            where: { id: candidateId },
            data: {
                // Force sync tabSwitches count with the total count of timestamps recorded
                tabSwitches: updatedTimestamps.length, 
                securityFlags: {
                    ...currentFlags,
                    timestamps: updatedTimestamps,
                    browser: browser || currentFlags.browser || "",
                    platform: platform || currentFlags.platform || "",
                },
            },
        });

        return NextResponse.json({
            success: true,
            tabSwitches: updated.tabSwitches
        });
    } catch (error) {
        console.error("Update Tab Switch Error:", error);
        return NextResponse.json({ error: "Failed to update tab switch" }, { status: 500 });
    }
}