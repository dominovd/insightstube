import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TRANSCRIPT_CHARS = 60_000;

export async function POST(req: NextRequest) {
  const limit = await rateLimit(`sum:${clientIp(req)}`, { perMinute: 2, perDay: 3 });
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI summaries are not configured yet." },
      { status: 503 }
    );
  }

  let body: { title?: string; transcript?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS);
  if (transcript.length < 100) {
    return NextResponse.json({ error: "Transcript is too short to summarize." }, { status: 400 });
  }

  const prompt = `You summarize YouTube videos from their transcripts. The transcript lines are prefixed with [mm:ss] timestamps.

Video title: ${body.title ?? "Unknown"}

Transcript:
${transcript}

Respond with ONLY valid JSON (no markdown fences) in this shape:
{
  "tldr": "2-3 sentence summary a busy person reads in 30 seconds",
  "summary": "one richer paragraph (4-6 sentences) covering the main arguments",
  "whoShouldWatch": "one sentence",
  "takeaways": [
    { "text": "key point phrased as a useful insight", "timestamp": "mm:ss" }
  ]
}
Give 3-5 takeaways. Use timestamps that actually appear in the transcript.`;

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
        max_tokens: 1200,
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
      return NextResponse.json({ error: "Could not generate a summary." }, { status: 502 });
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Could not generate a summary." }, { status: 502 });
  }
}
