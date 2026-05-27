import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
  "qwen/qwen3-32b",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!conversation) {
      return NextResponse.json({ error: "No conversation" }, { status: 400 });
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        console.log(`[ai-feedback] Trying: ${model}`);

        const completion = await groq.chat.completions.create({
          model,
          messages:        [{ role: "user", content: FINAL_PROMPT }],
          max_tokens:      1000,
          temperature:     0.3,
          response_format: { type: "json_object" }, // ✅ pure JSON
        });

        const raw    = completion.choices?.[0]?.message?.content || "";
        const parsed = JSON.parse(raw);
        console.log(`✅ [ai-feedback] Success with ${model}`);
        return NextResponse.json(parsed);

      } catch (err) {
        console.warn(`❌ [ai-feedback] ${model} — ${err?.message}`);
        lastError = err;
        if (err?.status === 429) await sleep(3000);
        continue;
      }
    }

    return NextResponse.json(
      { error: "Feedback unavailable. Try again shortly." },
      { status: 503 }
    );
  } catch (e) {
    console.error("[ai-feedback] Fatal:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate feedback" },
      { status: 500 }
    );
  }
}