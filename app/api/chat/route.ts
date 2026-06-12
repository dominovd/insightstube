import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TRANSCRIPT_CHARS = 50_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2_000;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`chat:${clientIp(req)}`, { perMinute: 3, perDay: 7 });
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is not configured yet." }, { status: 503 });
  }

  let body: { title?: string; transcript?: string; messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS);
  if (transcript.length < 100) {
    return NextResponse.json({ error: "Load a transcript first." }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter(
      (m): m is ChatMessage =>
        (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string"
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (!history.length || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }

  const system = `You answer questions about one specific YouTube video using ONLY its transcript. The transcript lines are prefixed with [mm:ss] timestamps.

Video title: ${body.title ?? "Unknown"}

Rules:
- Answer based only on the transcript. If the answer is not in the transcript, say so plainly.
- Be concise: a few sentences, or a short list when the question asks for several items.
- When you reference a specific moment, include its timestamp in the form [mm:ss].
- Quote the speaker's exact words when the user asks for quotes.
- Reply in the language of the user's question.

Transcript:
${transcript}`;

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
        max_tokens: 800,
        system,
        messages: history,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "AI service is busy. Try again in a minute." }, { status: 502 });
    }

    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    if (!text) {
      return NextResponse.json({ error: "Could not generate an answer." }, { status: 502 });
    }
    return NextResponse.json({ answer: text });
  } catch {
    return NextResponse.json({ error: "Could not generate an answer." }, { status: 502 });
  }
}
