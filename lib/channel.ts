export interface ChannelVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  subtitle?: string; // date for "latest", view count for "best"
}

const KEY = () => process.env.TRANSCRIPT_API_KEY;
const WEEK = 604800;
const MONTH = 2592000;

function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function parseViews(text?: string): number {
  if (!text) return 0;
  const m = text.match(/([\d.,]+)\s*([KMB]?)\s*views/i);
  if (!m) return 0;
  let n = parseFloat(m[1].replace(/,/g, ""));
  const u = (m[2] || "").toUpperCase();
  if (u === "K") n *= 1e3;
  else if (u === "M") n *= 1e6;
  else if (u === "B") n *= 1e9;
  return n;
}

function thumb(videoId: string, t?: { url?: string }): string {
  return t?.url ?? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

// Latest uploads (free channel/latest endpoint), refreshed weekly.
export async function getLatestVideos(handle: string, limit = 3): Promise<ChannelVideo[]> {
  const key = KEY();
  if (!key) return [];
  try {
    const res = await fetch(
      `https://transcriptapi.com/api/v2/youtube/channel/latest?channel=${encodeURIComponent("@" + handle)}`,
      { headers: { authorization: `Bearer ${key}` }, next: { revalidate: WEEK } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: unknown[] = Array.isArray(data?.results) ? data.results : [];
    return results
      .map((v) => {
        const r = v as { videoId?: string; title?: string; published?: string; thumbnail?: { url?: string } };
        if (!r.videoId) return null;
        return {
          videoId: r.videoId,
          title: r.title ?? "Untitled",
          thumbnail: thumb(r.videoId, r.thumbnail),
          subtitle: fmtDate(r.published),
        } as ChannelVideo;
      })
      .filter((v): v is ChannelVideo => Boolean(v))
      .slice(0, limit);
  } catch {
    return [];
  }
}

// Most-viewed recent uploads (channel/videos, 1 credit/call). Cached monthly
// since a channel's top videos change slowly. Used for the "Best" toggle.
export async function getTopVideos(handle: string, limit = 3): Promise<ChannelVideo[]> {
  const key = KEY();
  if (!key) return [];
  try {
    const res = await fetch(
      `https://transcriptapi.com/api/v2/youtube/channel/videos?channel=${encodeURIComponent("@" + handle)}`,
      { headers: { authorization: `Bearer ${key}` }, next: { revalidate: MONTH } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: unknown[] = Array.isArray(data?.results) ? data.results : [];
    return results
      .map((v) => {
        const r = v as {
          videoId?: string;
          title?: string;
          viewCountText?: string;
          thumbnails?: { url?: string }[];
        };
        if (!r.videoId) return null;
        const views = parseViews(r.viewCountText);
        const viewsText = r.viewCountText?.match(/[\d.,]+\s*[KMB]?\s*views/i)?.[0];
        return {
          views,
          video: {
            videoId: r.videoId,
            title: r.title ?? "Untitled",
            thumbnail: thumb(r.videoId, r.thumbnails?.[0]),
            subtitle: viewsText,
          } as ChannelVideo,
        };
      })
      .filter((x): x is { views: number; video: ChannelVideo } => Boolean(x))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
      .map((x) => x.video);
  } catch {
    return [];
  }
}
