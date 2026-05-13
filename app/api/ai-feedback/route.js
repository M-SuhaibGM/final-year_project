import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    // Ensure conversation is a string if your prompt template expects it
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      // OpenRouter sometimes requires these headers for certain models
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Change to your site URL in production
        "X-Title": "AI Interviewer",
      }
    });

    const completion = await openai.chat.completions.create({
      // FIXED: Use a stable free model or the updated Mistral slug
      model: "meta-llama/llama-3.3-70b-instruct:free", // Great free-tier alternative
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    if (completion.choices && completion.choices.length > 0) {
      return NextResponse.json(completion.choices[0].message.content);
    } else {
      return NextResponse.json({ error: "No response content found." }, { status: 500 });
    }

  } catch (e) {
    console.error("Route Error:", e);
    // Return a structured error so your frontend can read it
    return NextResponse.json(
      { error: e.message || "Failed to fetch AI feedback" },
      { status: e.status || 500 }
    );
  }
}