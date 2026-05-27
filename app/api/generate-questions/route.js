// app/api/generate-questions/route.js  (or whatever your file is named)
import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
  "llama3-8b-8192",
  "gemma2-9b-it",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, duration, type } = await req.json();

    if (!jobPosition || !jobDescription || !duration || !type) {
      return NextResponse.json(
        { error: "jobPosition, jobDescription, duration and type are all required" },
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
        console.log(`[generate-questions] Trying model: ${model}`);

        const completion = await groq.chat.completions.create({
          model,
          messages:    [{ role: "user", content: FINAL_PROMPT }],
          max_tokens:  1000,
          temperature: 0.7, // slightly higher = more varied questions
        });

        const raw   = completion.choices?.[0]?.message?.content || "";
        const clean = raw.replace(/```json|```/gi, "").trim();

        // ✅ Validate JSON before returning — catches hallucinated non-JSON
        const parsed = JSON.parse(clean);
        console.log(`✅ [generate-questions] Success with ${model}`);
        return NextResponse.json(parsed);

      } catch (err) {
        const is429     = err?.status === 429;
        const isJsonErr = err instanceof SyntaxError;

        console.warn(`❌ [generate-questions] ${model} failed — ${err?.message}`);
        lastError = err;

        if (is429) {
          console.warn(`⏳ Rate limited on ${model} — waiting 3s then trying next`);
          await sleep(3000);
        }

        continue; // always try next model
      }
    }

    console.error("[generate-questions] All models failed:", lastError?.message);
    return NextResponse.json(
      { error: "Question generation temporarily unavailable. Please try again." },
      { status: 503 }
    );

  } catch (e) {
    console.error("[generate-questions] Unexpected error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate questions" },
      { status: e.status || 500 }
    );
  }
}