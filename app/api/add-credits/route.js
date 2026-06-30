// app/api/add-credits/route.js
import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    // ✅ Check if already processed FIRST — before hitting Stripe
    const existing = await db.payment.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (existing) {
      // ✅ Already done — return success so frontend stops retrying
      console.log("Payment already processed:", sessionId);
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        creditsAdded: existing.creditsAdded,
      });
    }

    // ✅ Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const userEmail   = session.metadata?.email || session.customer_email;
    const creditsToAdd = Number(session.metadata?.credits);
    const amount       = session.amount_total / 100;

    if (!userEmail || !creditsToAdd) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // ✅ Use a transaction so credits + payment record are atomic
    await db.$transaction([
      db.user.update({
        where: { email: userEmail },
        data:  { credits: { increment: creditsToAdd } },
      }),
      db.payment.create({
        data: {
          stripeSessionId: sessionId,
          userEmail,
          amount,
          creditsAdded: creditsToAdd,
        },
      }),
    ]);

    console.log(`✅ Credits added: ${creditsToAdd} for ${userEmail}`);
    return NextResponse.json({ success: true, creditsAdded: creditsToAdd });

  } catch (err) {
    // ✅ Handle race condition — if two requests hit simultaneously
    //    and both pass the duplicate check, the second will get P2002
    if (err?.code === "P2002") {
      console.log("Race condition — payment already recorded");
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    console.error("Payment Sync Error:", err);
    return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
  }
}