import { QUESTIONS_PROMPT } from "@/services/Constants";
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
    const { jobPosition, jobDescription, duration, type } = await req.json();

    if (!jobPosition || !jobDescription || !duration || !type) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT
      .replace("{{jobTitle}}",       jobPosition)
      .replace("{{jobDescription}}", jobDescription)
      .replace("{{duration}}",       duration)
      .replace("{{type}}",           type);

    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        console.log(`[generate-questions] Trying: ${model}`);

        const completion = await groq.chat.completions.create({
          model,
          messages:        [{ role: "user", content: FINAL_PROMPT }],
          max_tokens:      1000,
          temperature:     0.7,
          response_format: { type: "json_object" }, // ✅ pure JSON — no parse errors
        });

        const raw    = completion.choices?.[0]?.message?.content || "";
        const parsed = JSON.parse(raw);
        console.log(`✅ [generate-questions] Success with ${model}`);
        return NextResponse.json(parsed);

      } catch (err) {
        console.warn(`❌ [generate-questions] ${model} — ${err?.message}`);
        lastError = err;
        if (err?.status === 429) await sleep(3000);
        continue;
      }
    }

    return NextResponse.json(
      { error: "Question generation unavailable. Try again shortly." },
      { status: 503 }
    );
  } catch (e) {
    console.error("[generate-questions] Fatal:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}