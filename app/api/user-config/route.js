import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const config = await prisma.userConfig.findUnique({
    where: { userEmail: session.user.email }
  });
  return NextResponse.json(config || { language: "en-US", voiceId: "jennifer" });
}

export async function PUT(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { language, voiceId } = await req.json();

  const updatedConfig = await prisma.userConfig.upsert({
    where: { userEmail: session.user.email },
    update: { language, voiceId },
    create: { userEmail: session.user.email, language, voiceId },
  });

  return NextResponse.json(updatedConfig);
} 