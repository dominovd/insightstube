export interface Segment {
  start: number; // seconds
  dur: number;
  text: string;
}

export interface TranscriptResult {
  videoId: string;
  title: string;
  author: string;
  lengthSeconds: number;
  lang: string;
  langName: string;
  availableLangs: { code: string; name: string }[];
  segments: Segment[];
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.slice(1, 12) || null;
    if (host.endsWith("youtube.com")) {
      if (url.searchParams.get("v")) return url.searchParams.get("v");
      const m = url.pathname.match(/\/(shorts|embed|live)\/([\w-]{11})/);
      if (m) return m[2];
    }
  } catch {
    return null;
  }
  return null;
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string;
  name?: { simpleText?: string; runs?: { text: string }[] };
}

function trackName(t: CaptionTrack): string {
  return t.name?.simpleText ?? t.name?.runs?.map((r) => r.text).join("") ?? t.languageCode;
}

export async function fetchTranscript(
  videoId: string,
  preferredLang?: string
): Promise<TranscriptResult> {
  let watchRes: Response;
  try {
    watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
      headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" },
      cache: "no-store",
    });
  } catch {
    throw new Error("Could not reach YouTube. Please try again in a moment.");
  }
  if (!watchRes.ok) throw new Error(`YouTube returned ${watchRes.status}`);
  const html = await watchRes.text();

  const prMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;(?:\s*var\s|\s*<\/script>)/s);
  if (!prMatch) throw new Error("Could not read video data. The video may be private or unavailable.");

  let player: any;
  try {
    player = JSON.parse(prMatch[1]);
  } catch {
    throw new Error("Could not parse video data.");
  }

  const status = player?.playabilityStatus?.status;
  if (status && status !== "OK") {
    throw new Error(
      player?.playabilityStatus?.reason || "This video is unavailable."
    );
  }

  const details = player?.videoDetails ?? {};
  const tracks: CaptionTrack[] =
    player?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];

  if (!tracks.length) {
    throw new Error(
      "This video has no captions — the creator disabled them and YouTube has no auto-captions."
    );
  }

  // pick track: preferred → manual en → any en → first manual → first
  const pick =
    (preferredLang && tracks.find((t) => t.languageCode === preferredLang)) ||
    tracks.find((t) => t.languageCode.startsWith("en") && t.kind !== "asr") ||
    tracks.find((t) => t.languageCode.startsWith("en")) ||
    tracks.find((t) => t.kind !== "asr") ||
    tracks[0];

  const capUrl = pick.baseUrl.includes("fmt=") ? pick.baseUrl : pick.baseUrl + "&fmt=json3";
  const capRes = await fetch(capUrl, { headers: { "user-agent": UA }, cache: "no-store" });
  if (!capRes.ok) throw new Error("Could not download the caption track.");
  const cap = await capRes.json();

  const segments: Segment[] = (cap.events ?? [])
    .filter((e: any) => e.segs && e.segs.some((s: any) => (s.utf8 ?? "").trim()))
    .map((e: any) => ({
      start: Math.round((e.tStartMs ?? 0) / 10) / 100,
      dur: Math.round((e.dDurationMs ?? 0) / 10) / 100,
      text: e.segs
        .map((s: any) => s.utf8 ?? "")
        .join("")
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    }))
    .filter((s: Segment) => s.text);

  if (!segments.length) throw new Error("The caption track is empty.");

  return {
    videoId,
    title: details.title ?? "Untitled video",
    author: details.author ?? "",
    lengthSeconds: Number(details.lengthSeconds ?? 0),
    lang: pick.languageCode,
    langName: trackName(pick),
    availableLangs: tracks.map((t) => ({ code: t.languageCode, name: trackName(t) })),
    segments,
  };
}
