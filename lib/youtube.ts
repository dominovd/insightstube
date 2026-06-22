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
  debugTrace?: string[];
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

/** Human-friendly label for a bare language code (used by providers that only
 *  return a code, like transcriptapi). Falls back to the code itself. */
function langLabel(code: string): string {
  if (!code || code === "default") return "Default";
  const base = code.split("-")[0].toLowerCase();
  try {
    const dn = new Intl.DisplayNames(["en"], { type: "language" });
    return dn.of(base) ?? code;
  } catch {
    return code;
  }
}

/** True when a caption language code is an English variant (en, en-US, en-GB…). */
function isEnglish(code: string): boolean {
  return /^en(-|$)/i.test(code);
}

function captionJsonUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("fmt", "json3");
  url.searchParams.set("xorb", "2");
  url.searchParams.set("xobt", "3");
  url.searchParams.set("xovt", "3");
  return url.toString();
}

/** Primary: InnerTube player API as the Android client, not affected by
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

/** Web InnerTube often exposes the full caption track list for multilingual
 *  videos, letting us prefer English instead of YouTube's transcript-panel default. */
async function playerViaWebInnertube(videoId: string): Promise<any> {
  const res = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": WEB_UA,
      origin: "https://www.youtube.com",
      referer: `https://www.youtube.com/watch?v=${videoId}&hl=en`,
      "accept-language": "en-US,en;q=0.9",
      "x-youtube-client-name": "1",
      "x-youtube-client-version": "2.20250606.01.00",
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20250606.01.00",
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
  if (!res.ok) throw new Error(`Web InnerTube returned ${res.status}`);
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

/** Recursively find the first object containing the given key. */
function deepFind(obj: any, key: string): any {
  if (!obj || typeof obj !== "object") return undefined;
  if (key in obj) return obj[key];
  for (const v of Object.values(obj)) {
    const found = deepFind(v, key);
    if (found !== undefined) return found;
  }
  return undefined;
}

function parsePanelSegments(data: any): Segment[] {
  const initialSegments = deepFind(data, "initialSegments") ?? [];
  return initialSegments
    .map((s: any) => s.transcriptSegmentRenderer)
    .filter(Boolean)
    .map((r: any) => {
      const start = Number(r.startMs ?? 0) / 1000;
      const end = Number(r.endMs ?? 0) / 1000;
      return {
        start: Math.round(start * 100) / 100,
        dur: Math.round(Math.max(end - start, 0) * 100) / 100,
        text: (r.snippet?.runs ?? [])
          .map((x: any) => x.text ?? "")
          .join("")
          .replace(/\s+/g, " ")
          .trim(),
      };
    })
    .filter((s: Segment) => s.text);
}

interface PanelLangItem {
  title: string;
  selected: boolean;
  params?: string;
}

/** The transcript panel exposes a language picker in its footer. Each item
 *  carries the `params`/continuation needed to re-request get_transcript in
 *  that language, which is how we get English instead of YouTube's default. */
function panelLanguageItems(data: any): PanelLangItem[] {
  const items = deepFind(data, "subMenuItems") ?? [];
  if (!Array.isArray(items)) return [];
  return items.map((it: any) => {
    const ep =
      it?.continuation?.reloadContinuationData?.continuation ??
      deepFind(it, "reloadContinuationData")?.continuation ??
      deepFind(it, "getTranscriptEndpoint")?.params;
    return {
      title: String(it?.title?.simpleText ?? it?.title ?? ""),
      selected: Boolean(it?.selected),
      params: typeof ep === "string" ? ep : undefined,
    };
  });
}

function pickEnglishPanelItem(items: PanelLangItem[]): PanelLangItem | undefined {
  const en = (t: string) => /english/i.test(t);
  return (
    items.find((i) => /^english$/i.test(i.title)) ||
    items.find((i) => en(i.title) && !/auto-?generated/i.test(i.title)) ||
    items.find((i) => en(i.title))
  );
}

/** Most datacenter-reliable: the engagement-panel transcript endpoint that
 *  youtube.com itself uses for the "Show transcript" button. Now language-aware:
 *  if the default panel language isn't what we want, switch via the footer
 *  language menu (English by default). */
async function fetchViaGetTranscript(
  videoId: string,
  preferredLang?: string
): Promise<TranscriptResult> {
  const context = {
    client: { clientName: "WEB", clientVersion: "2.20250606.01.00", hl: "en", gl: "US" },
  };
  const headers = {
    "content-type": "application/json",
    "user-agent": WEB_UA,
    origin: "https://www.youtube.com",
    referer: `https://www.youtube.com/watch?v=${videoId}`,
  };

  const callTranscript = async (params: string) => {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/get_transcript?prettyPrint=false",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ context, params }),
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`get_transcript returned ${res.status}`);
    return res.json();
  };

  const nextRes = await fetch("https://www.youtube.com/youtubei/v1/next?prettyPrint=false", {
    method: "POST",
    headers,
    body: JSON.stringify({ context, videoId }),
    cache: "no-store",
  });
  if (!nextRes.ok) throw new Error(`next returned ${nextRes.status}`);
  const nextData = await nextRes.json();

  const transcriptEndpoint = deepFind(nextData, "getTranscriptEndpoint");
  const params = transcriptEndpoint?.params;
  if (!params) throw new Error("No transcript panel for this video.");

  let data = await callTranscript(params);
  let items = panelLanguageItems(data);
  let chosen = items.find((i) => i.selected);

  // Switch language if the default isn't English (or the explicit preference).
  const wantEnglish = !preferredLang || /^en/i.test(preferredLang);
  const target = wantEnglish
    ? pickEnglishPanelItem(items)
    : items.find((i) => i.title.toLowerCase().includes(preferredLang!.toLowerCase()));
  if (target && !target.selected && target.params) {
    try {
      const switched = await callTranscript(target.params);
      const switchedSegs = parsePanelSegments(switched);
      if (switchedSegs.length) {
        data = switched;
        items = panelLanguageItems(data);
        chosen = target;
      }
    } catch {
      /* keep the default-language panel */
    }
  }

  const segments = parsePanelSegments(data);
  if (!segments.length) throw new Error("No transcript segments returned.");

  // Title/author via oEmbed (lightweight, rarely bot-checked)
  let title = "YouTube video";
  let author = "";
  try {
    const oe = await fetch(
      `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=json`,
      { headers: { "user-agent": WEB_UA }, cache: "no-store" }
    );
    if (oe.ok) {
      const j = await oe.json();
      title = j.title ?? title;
      author = j.author_name ?? "";
    }
  } catch {
    /* non-fatal */
  }

  const chosenTitle = chosen?.title ?? "";
  const lang = /english/i.test(chosenTitle)
    ? "en"
    : chosenTitle
      ? chosenTitle.toLowerCase()
      : "default";

  const last = segments[segments.length - 1];
  return {
    videoId,
    title,
    author,
    lengthSeconds: Math.round(last.start + last.dur),
    lang,
    langName: chosenTitle || "Default",
    availableLangs: items
      .filter((i) => i.title)
      .map((i) => ({ code: i.title.toLowerCase(), name: i.title })),
    segments,
  };
}

/** Paid provider (transcriptapi.com), used first when TRANSCRIPT_API_KEY is set.
 *  Reliable from datacenter IPs; direct methods below remain as fallback. */
async function fetchViaTranscriptApi(videoId: string): Promise<TranscriptResult> {
  const key = process.env.TRANSCRIPT_API_KEY;
  if (!key) throw new Error("no key");

  const res = await fetch(
    `https://transcriptapi.com/api/v2/youtube/transcript?video_url=${videoId}&format=json&include_timestamp=true&send_metadata=true`,
    { headers: { authorization: `Bearer ${key}` }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`transcriptapi ${res.status}`);
  const data = await res.json();

  const segments: Segment[] = (data.transcript ?? [])
    .map((s: any) => ({
      start: Math.round(Number(s.start ?? 0) * 100) / 100,
      dur: Math.round(Number(s.duration ?? 0) * 100) / 100,
      text: String(s.text ?? "").replace(/\s+/g, " ").trim(),
    }))
    .filter((s: Segment) => s.text);
  if (!segments.length) throw new Error("empty transcript");

  const meta = data.metadata ?? {};
  // transcriptapi returns the caption language at the top level (`data.language`),
  // not inside `metadata` — reading the wrong field made everything show "Default".
  const lang = String(data.language ?? meta.language ?? "default");
  const last = segments[segments.length - 1];
  return {
    videoId,
    title: meta.title ?? data.title ?? "YouTube video",
    author: meta.author_name ?? meta.author ?? meta.channel ?? meta.channel_name ?? "",
    lengthSeconds: Number(meta.duration ?? 0) || Math.round(last.start + last.dur),
    lang,
    langName: langLabel(lang),
    availableLangs: [],
    segments,
  };
}

/** Language-aware path: read the caption track list via InnerTube and download
 *  the right track. Unlike transcriptapi, this lets us prefer the original /
 *  English track instead of YouTube's translation default. Returns null when no
 *  caption tracks are exposed (so the caller can fall back). */
async function fetchViaPlayerTracks(
  videoId: string,
  preferredLang: string | undefined,
  errors: string[]
): Promise<TranscriptResult | null> {
  let player: any = null;

  for (const [name, attempt] of [
    ["android", playerViaInnertube],
    ["web", playerViaWebInnertube],
    ["watch", playerViaWatchPage],
  ] as const) {
    try {
      const p = await attempt(videoId);
      if (playable(p) && extractTracks(p).length) {
        player = p;
        break;
      }
      errors.push(
        `${name}: ` +
          (p?.playabilityStatus?.reason ||
            (playable(p) ? "no captions in response" : "video unavailable"))
      );
    } catch (e) {
      errors.push(`${name}: ${e instanceof Error ? e.message : "fetch failed"}`);
    }
  }

  if (!player || !extractTracks(player).length) return null;

  const details = player.videoDetails ?? {};
  const tracks = extractTracks(player);

  // pick track: explicit preferred → manual en → any en → first manual → first
  const pick =
    (preferredLang && tracks.find((t) => t.languageCode === preferredLang)) ||
    tracks.find((t) => isEnglish(t.languageCode) && t.kind !== "asr") ||
    tracks.find((t) => isEnglish(t.languageCode)) ||
    tracks.find((t) => t.kind !== "asr") ||
    tracks[0];

  const capUrl = captionJsonUrl(pick.baseUrl);

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

/** Content-based English check, independent of how a provider labels the track.
 *  Guards against providers that mislabel a translation as the requested code. */
function looksEnglish(result: TranscriptResult): boolean {
  const sample = result.segments.slice(0, 40).map((s) => s.text).join(" ");
  const compact = sample.replace(/\s+/g, "");
  if (!compact.length) return true;
  const latin = (sample.match(/[A-Za-zÀ-ɏ]/g) ?? []).length;
  return latin / compact.length > 0.5;
}

/** Does a result already match what the caller wants? With no explicit
 *  preference we default to English, since the site's audience is English.
 *  English is verified by content, not just the language label. */
function resultMatchesLang(result: TranscriptResult, preferredLang?: string): boolean {
  if (preferredLang && !/^en/i.test(preferredLang)) {
    return result.lang.toLowerCase().startsWith(preferredLang.toLowerCase());
  }
  return looksEnglish(result);
}

export async function fetchTranscript(
  videoId: string,
  preferredLang?: string,
  debug = false
): Promise<TranscriptResult> {
  const errors: string[] = [];
  const finish = (r: TranscriptResult, source: string): TranscriptResult => {
    if (debug) r.debugTrace = [...errors, `WON: ${source} (lang=${r.lang})`];
    return r;
  };

  // Language-aware upgrade attempts, ordered by how reliable each is from a
  // datacenter IP. The transcript panel works server-side and can switch
  // language; the player track download often fails from datacenter IPs.
  const upgradeToPreferred = async (): Promise<TranscriptResult | null> => {
    try {
      const viaPanel = await fetchViaGetTranscript(videoId, preferredLang);
      if (resultMatchesLang(viaPanel, preferredLang)) return viaPanel;
      errors.push(`panel: got "${viaPanel.lang}"`);
    } catch (e) {
      errors.push(`panel: ${e instanceof Error ? e.message : "failed"}`);
    }
    try {
      const viaTracks = await fetchViaPlayerTracks(videoId, preferredLang, errors);
      if (viaTracks && resultMatchesLang(viaTracks, preferredLang)) return viaTracks;
    } catch (e) {
      errors.push(`tracks: ${e instanceof Error ? e.message : "failed"}`);
    }
    return null;
  };

  // Paid provider first, when configured: reliable from datacenter IPs, but it
  // has no language parameter, so for multilingual videos it can hand back a
  // translation (e.g. Arabic) instead of the original/English track.
  if (process.env.TRANSCRIPT_API_KEY) {
    try {
      const apiResult = await fetchViaTranscriptApi(videoId);
      if (resultMatchesLang(apiResult, preferredLang)) return finish(apiResult, "api");

      // Wrong language (e.g. a translation): try to get the preferred language
      // from YouTube directly. Only override if it actually matched.
      errors.push(`api: returned "${apiResult.lang}", wanted ${preferredLang ?? "en"}`);
      const upgraded = await upgradeToPreferred();
      if (upgraded) return finish(upgraded, "upgrade");

      // Couldn't get the preferred language anywhere — the API result (likely the
      // video's only/original captions) is still the best we have.
      return finish(apiResult, "api-fallback");
    } catch (e) {
      errors.push(`api: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  // No key, or the paid provider failed entirely.
  const direct = await upgradeToPreferred();
  if (direct) return finish(direct, "direct");

  // Last resort: return whatever the panel/tracks produced, even if not the
  // preferred language, rather than failing outright.
  try {
    return finish(await fetchViaGetTranscript(videoId, preferredLang), "panel-any");
  } catch (e) {
    errors.push(`panel: ${e instanceof Error ? e.message : "failed"}`);
  }
  try {
    const viaTracks = await fetchViaPlayerTracks(videoId, preferredLang, errors);
    if (viaTracks) return finish(viaTracks, "tracks-any");
  } catch (e) {
    errors.push(`tracks: ${e instanceof Error ? e.message : "failed"}`);
  }

  throw new Error(
    debug
      ? errors.join(" | ")
      : "Couldn't fetch the transcript for this video. It may have no captions, or YouTube is temporarily blocking requests. Please try again."
  );
}
