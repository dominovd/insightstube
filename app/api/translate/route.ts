import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SEGMENTS = 1200;
const MAX_TOTAL_CHARS = 60_000;
const CHUNK_SIZE = 80; // lines per Claude call

interface InSegment {
  start: number;
  text: string;
}

async function translateChunk(
  apiKey: string,
  language: string,
  lines: string[]
): Promise<string[]> {
  const prompt = `Translate the following subtitle lines into ${language}.

The input is a JSON array of strings. Return ONLY a JSON array of the same length, in the same order, where each element is the ${language} translation of the line at the same index. Keep bracketed cues like [music] or (laughter) but translate the words inside them naturally. Do not merge, split, add, drop, or renumber elements — the output array length MUST equal the input array length. Output nothing but the JSON array.

Input:
${JSON.stringify(lines)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`anthropic ${res.status}`);
  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("no array in response");

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new Error("bad json");
  }
  if (!Array.isArray(parsed)) throw new Error("not an array");

  // Keep alignment with the input no matter what the model returned: pad with
  // the original line when short, ignore extras when long.
  return lines.map((orig, i) => {
    const v = parsed[i];
    return typeof v === "string" && v.trim() ? v : orig;
  });
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(`trl:${clientIp(req)}`, { perMinute: 2, perDay: 3 });
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Translation is not configured yet." }, { status: 503 });
  }

  let body: { language?: string; segments?: InSegment[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const language = (body.language ?? "").trim();
  if (!language || language.length > 40) {
    return NextResponse.json({ error: "Pick a language to translate into." }, { status: 400 });
  }

  const segments = (Array.isArray(body.segments) ? body.segments : [])
    .filter((s) => s && typeof s.text === "string")
    .slice(0, MAX_SEGMENTS);
  if (!segments.length) {
    return NextResponse.json({ error: "Load a transcript first." }, { status: 400 });
  }

  const lines: string[] = [];
  let total = 0;
  for (const s of segments) {
    const t = s.text;
    if (total + t.length > MAX_TOTAL_CHARS) break;
    total += t.length;
    lines.push(t);
  }
  if (!lines.length) {
    return NextResponse.json({ error: "Transcript is too long to translate." }, { status: 400 });
  }

  try {
    const out: string[] = [];
    for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
      const chunk = lines.slice(i, i + CHUNK_SIZE);
      const translated = await translateChunk(apiKey, language, chunk);
      out.push(...translated);
    }
    // If we capped the transcript, leave the remaining lines untranslated so
    // the client can still align translations to every segment by index.
    while (out.length < segments.length) out.push(segments[out.length].text);

    return NextResponse.json({ language, translations: out, truncated: lines.length < segments.length });
  } catch {
    return NextResponse.json(
      { error: "Couldn't translate the transcript. Try again in a minute." },
      { status: 502 }
    );
  }
}
