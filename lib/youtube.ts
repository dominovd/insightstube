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

const WEB_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const ANDROID_UA =
  "com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip";

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

/** Primary: InnerTube player API as the Android client — not affected by
 *  the "sign in to confirm you're not a bot" check on datacenter IPs. */
async function playerViaInnertube(videoId: string): Promise<any> {
  const res = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": ANDROID_UA,
      "x-youtube-client-name": "3",
      "x-youtube-client-version": "20.10.38",
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "ANDROID",
          clientVersion: "20.10.38",
          androidSdkVersion: 30,
          hl: "en",
          gl: "US",
          utcOffsetMinutes: 0,
        },
      },
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`InnerTube returned ${res.status}`);
  return res.json();
}

/** Fallback: scrape ytInitialPlayerResponse from the watch page. */
async function playerViaWatchPage(videoId: string): Promise<any> {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
    headers: { "user-agent": WEB_UA, "accept-language": "en-US,en;q=0.9" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`YouTube returned ${res.status}`);
  const html = await res.text();
  const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;(?:\s*var\s|\s*<\/script>)/s);
  if (!m) throw new Error("Could not read video data.");
  return JSON.parse(m[1]);
}

function extractTracks(player: any): CaptionTrack[] {
  return player?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? [];
}

function playable(player: any): boolean {
  const status = player?.playabilityStatus?.status;
  return !status || status === "OK";
}

export async function fetchTranscript(
  videoId: string,
  preferredLang?: string
): Promise<TranscriptResult> {
  let player: any = null;
  let lastError = "";

  // Try InnerTube (Android) first, then the watch page.
  for (const attempt of [playerViaInnertube, playerViaWatchPage]) {
    try {
      const p = await attempt(videoId);
      if (playable(p) && extractTracks(p).length) {
        player = p;
        break;
      }
      lastError =
        p?.playabilityStatus?.reason ||
        (playable(p) ? "This video has no captions." : "This video is unavailable.");
      if (playable(p) && !player) player = player ?? p; // keep details for error msg
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Could not reach YouTube.";
    }
  }

  if (!player || !extractTracks(player).length) {
    throw new Error(
      lastError ||
        "This video has no captions — the creator disabled them and YouTube has no auto-captions."
    );
  }

  const details = player.videoDetails ?? {};
  const tracks = extractTracks(player);

  // pick track: preferred → manual en → any en → first manual → first
  const pick =
    (preferredLang && tracks.find((t) => t.languageCode === preferredLang)) ||
    tracks.find((t) => t.languageCode.startsWith("en") && t.kind !== "asr") ||
    tracks.find((t) => t.languageCode.startsWith("en")) ||
    tracks.find((t) => t.kind !== "asr") ||
    tracks[0];

  const capUrl =
    (pick.baseUrl.includes("fmt=") ? pick.baseUrl : pick.baseUrl + "&fmt=json3") +
    "&xorb=2&xobt=3&xovt=3"; // harmless params some clients send

  let cap: any;
  try {
    const capRes = await fetch(capUrl, {
      headers: { "user-agent": ANDROID_UA },
      cache: "no-store",
    });
    if (!capRes.ok) throw new Error(`captions ${capRes.status}`);
    cap = await capRes.json();
  } catch {
    throw new Error("Could not download the caption track. Please try again.");
  }

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
