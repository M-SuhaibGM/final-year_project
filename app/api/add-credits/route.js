import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await req.json();

    // 1. Check if this payment session was already processed
    const existingPayment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId }
    });

    if (existingPayment) {
      return NextResponse.json({ error: "Credits already added" }, { status: 400 });
    }

    // 2. Verify with Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
    }

    /* MODIFICATION: 
       Get the credit amount from the metadata we set in the Checkout API.
       We use parseInt because metadata values are always strings.
    */
    const creditsToAdd = parseInt(stripeSession.metadata.credits);

    if (isNaN(creditsToAdd)) {
      return NextResponse.json({ error: "Invalid credit data in session" }, { status: 400 });
    }

    // 3. Atomic Transaction: Add credits AND record the payment
    await prisma.$transaction([
      prisma.user.update({
        where: { email: session.user.email },
        data: { credits: { increment: creditsToAdd } },
      }),
      prisma.payment.create({
        data: {
          stripeSessionId: sessionId,
          userEmail: session.user.email,
          amount: stripeSession.amount_total / 100,
          creditsAdded: creditsToAdd,
        }
      })
    ]);

    return NextResponse.json({ success: true, added: creditsToAdd });
  } catch (error) {
    console.error("Payment Sync Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}