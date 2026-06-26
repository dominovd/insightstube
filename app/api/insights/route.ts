import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TRANSCRIPT_CHARS = 60_000;

export async function POST(req: NextRequest) {
  const limit = rateLimit(`ins:${clientIp(req)}`, { perMinute: 2, perDay: 3 });
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Insights are not configured yet." }, { status: 503 });
  }

  let body: { title?: string; transcript?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS);
  if (transcript.length < 100) {
    return NextResponse.json({ error: "Transcript is too short to analyze." }, { status: 400 });
  }

  const prompt = `You extract structured insights from a YouTube video transcript. Transcript lines are prefixed with [mm:ss] timestamps.

Video title: ${body.title ?? "Unknown"}

Transcript:
${transcript}

Respond with ONLY valid JSON (no markdown fences) in this shape:
{
  "chapters": [ { "time": "mm:ss", "title": "short section title, 3-6 words" } ],
  "mentions": [ { "type": "person", "name": "what was mentioned", "time": "mm:ss" } ]
}

Rules:
- chapters: 4-10 sections covering the whole video in chronological order. "time" MUST be a timestamp that appears in the transcript. Titles are concise and specific, no numbering.
- mentions: concrete named things actually said in the video — people, books, tools/products, companies, places, or other notable references. "type" is one of: person, book, tool, company, place, other. Use the timestamp where each is first mentioned. Up to 20 items. If there are none, use an empty array.
- Do not invent timestamps, names, or content that is not in the transcript.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "AI service is busy. Try again in a minute." }, { status: 502 });
    }

    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not extract insights." }, { status: 502 });
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
      mentions: Array.isArray(parsed.mentions) ? parsed.mentions : [],
    });
  } catch {
    return NextResponse.json({ error: "Could not extract insights." }, { status: 502 });
  }
}
