const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const candidates = [
        {
            interviewId: "93b7014b-2beb-4d92-ad74-378f19901db0",
            userName: "Ahmed Khan",
            userEmail: "ahmed@test.com",
            feedback: {
                rating: {
                    technicalSkills: 9,
                    communication: 8,
                    problemSolving: 9,
                    experience: 8
                },
                summary: "Ahmed demonstrated exceptional proficiency in full-stack architecture. His approach to React performance optimization was impressive.",
                recommendation: "Yes",
                recommendationMsg: "Highly recommended for a senior developer role due to strong technical and problem-solving skills."
            },
            exitReason: "Completed",
            completionStatus: "Success",
            progressAtExit: 100.0,
        },
        {
            interviewId: "93b7014b-2beb-4d92-ad74-378f19901db0",
            userName: "Sara Ali",
            userEmail: "sara@test.com",
            feedback: {
                rating: {
                    technicalSkills: 4,
                    communication: 6,
                    problemSolving: 4,
                    experience: 3
                },
                summary: "Sara has good communication skills but lacks the depth required in JavaScript fundamentals and modern CSS frameworks.",
                recommendation: "No",
                recommendationMsg: "Not recommended at this time. Suggest focusing on technical fundamentals and trying again in 3 months."
            },
            exitReason: "User closed tab",
            completionStatus: "Incomplete",
            progressAtExit: 45.5,
        },
        {
            interviewId: "93b7014b-2beb-4d92-ad74-378f19901db0",
            userName: "Zainab Malik",
            userEmail: "zainab@test.com",
            feedback: null, // Good for testing your optional chaining (?.) in the UI
            exitReason: "Internet Disconnected",
            completionStatus: "Technical Issue",
            progressAtExit: 10.0,
        }
    ];

    for (const c of candidates) {
        await prisma.candidateDetails.create({ data: c });
    }

    console.log("Updated test entries with correct UI schema inserted!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });