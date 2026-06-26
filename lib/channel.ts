export interface ChannelVideo {
  videoId: string;
  title: string;
  published?: string;
  thumbnail: string;
}

// Latest uploads for a channel via transcriptapi's free channel/latest endpoint.
// Used to keep the topic landing pages fresh without manual updates.
export async function getLatestVideos(handle: string, limit = 3): Promise<ChannelVideo[]> {
  const key = process.env.TRANSCRIPT_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(
      `https://transcriptapi.com/api/v2/youtube/channel/latest?channel=${encodeURIComponent(
        "@" + handle
      )}`,
      {
        headers: { authorization: `Bearer ${key}` },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: unknown[] = Array.isArray(data?.results) ? data.results : [];
    return results
      .map((v) => {
        const r = v as {
          videoId?: string;
          title?: string;
          published?: string;
          thumbnail?: { url?: string };
        };
        if (!r.videoId) return null;
        return {
          videoId: r.videoId,
          title: r.title ?? "Untitled",
          published: r.published,
          thumbnail: r.thumbnail?.url ?? `https://i.ytimg.com/vi/${r.videoId}/mqdefault.jpg`,
        } as ChannelVideo;
      })
      .filter((v): v is ChannelVideo => Boolean(v))
      .slice(0, limit);
  } catch {
    return [];
  }
}
