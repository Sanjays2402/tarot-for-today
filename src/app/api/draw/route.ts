import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, userPromptFor } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

type CardResponse = { card: string; glyph: string; upright: string; asks: string };

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Set OPENAI_API_KEY in .env.local" }, { status: 500 });
  }

  let body: { mood?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const mood = body.mood?.trim();
  if (!mood) return NextResponse.json({ error: "mood is required" }, { status: 400 });
  if (mood.length > 240) return NextResponse.json({ error: "Keep it under 240 characters" }, { status: 400 });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 1.0,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPromptFor(mood) },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    let parsed: CardResponse;
    try {
      parsed = JSON.parse(text) as CardResponse;
    } catch {
      return NextResponse.json({ error: "Model returned non-JSON output", raw: text }, { status: 502 });
    }

    if (!parsed.card || !parsed.glyph || !parsed.upright || !parsed.asks) {
      return NextResponse.json({ error: "Model output missing fields", raw: parsed }, { status: 502 });
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      typeof err === "object" && err && "status" in err
        ? (err as { status?: number }).status ?? 500
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
