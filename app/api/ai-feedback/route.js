// app/api/ai-feedback/route.js
import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Fallback chain — fastest/best first
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",  // best quality
  "llama3-70b-8192",           // fallback 1
  "llama3-8b-8192",            // fallback 2 — fastest
  "gemma2-9b-it",              // fallback 3
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  try {
    const { conversation } = await req.json();
    console.log("📥 [ai-feedback] Received conversation length:", conversation?.length ?? 0);

    if (!conversation) {
      return NextResponse.json(
        { error: "No conversation provided" },
        { status: 400 }
      );
    }

    // ✅ Use your existing FEEDBACK_PROMPT constant — no change needed
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages:    [{ role: "user", content: FINAL_PROMPT }],
          max_tokens:  1000,
          temperature: 0.3, // lower = more consistent JSON
        });

        const raw = completion.choices?.[0]?.message?.content || "";

        // ✅ Clean markdown fences if model wraps in ```json
        const clean = raw.replace(/```json|```/gi, "").trim();

        // ✅ Validate it's real JSON before returning
        const parsed = JSON.parse(clean);
        return NextResponse.json(parsed);

      } catch (err) {
        const is429     = err?.status === 429;
        const isJsonErr = err instanceof SyntaxError;
        lastError = err;

        if (is429) {
          console.warn(`⏳ [ai-feedback] Rate limited on ${model} — waiting 3s then trying next`);
          await sleep(3000);
        }

        // Always try the next model (429, JSON error, or anything else)
        continue;
      }
    }

    // All 4 models failed
    console.error("🔥 [ai-feedback] All Groq models failed. Last error:", lastError?.message);
    return NextResponse.json(
      { error: "Feedback generation temporarily unavailable. Please try again in a moment." },
      { status: 503 }
    );

  } catch (e) {
    console.error("🔥 [ai-feedback] Unexpected error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate feedback" },
      { status: e.status || 500 }
    );
  }
}