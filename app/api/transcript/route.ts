import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, fetchTranscript } from "@/lib/youtube";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

async function handle(req: NextRequest, url: string, lang?: string) {
  const limit = rateLimit(`tr:${clientIp(req)}`, { perMinute: 10, perDay: 200 });
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return NextResponse.json(
      { error: "That doesn't look like a YouTube link. Paste a full video URL." },
      { status: 400 }
    );
  }

  try {
    const result = await fetchTranscript(videoId, lang);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

export async function POST(req: NextRequest) {
  let body: { url?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  return handle(req, body.url ?? "", body.lang);
}

// GET variant for quick testing: /api/transcript?url=...
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") ?? "";
  return handle(req, url, req.nextUrl.searchParams.get("lang") ?? undefined);
}
