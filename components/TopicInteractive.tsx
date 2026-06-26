"use client";

import { useRef, useState } from "react";
import TranscriptTool from "./TranscriptTool";
import type { TopicChannel } from "@/lib/topics";
import type { ChannelVideo } from "@/lib/channel";

type ChannelWithVideos = TopicChannel & { latest: ChannelVideo[]; best: ChannelVideo[] };

export default function TopicInteractive({ channels }: { channels: ChannelWithVideos[] }) {
  const [pendingUrl, setPendingUrl] = useState("");
  const [nonce, setNonce] = useState(0);
  const toolRef = useRef<HTMLDivElement>(null);

  function loadVideo(videoId: string) {
    setPendingUrl(`https://www.youtube.com/watch?v=${videoId}`);
    setNonce((n) => n + 1);
    requestAnimationFrame(() =>
      toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }

  return (
    <>
      <div ref={toolRef} className="topic-tool">
        <TranscriptTool showExamples={false} pendingUrl={pendingUrl} pendingNonce={nonce} />
      </div>

      <section className="topic-channels">
        {channels.map((c) => (
          <ChannelCard key={c.handle} channel={c} onPlay={loadVideo} />
        ))}
      </section>
    </>
  );
}

function ChannelCard({
  channel,
  onPlay,
}: {
  channel: ChannelWithVideos;
  onPlay: (videoId: string) => void;
}) {
  const hasBest = channel.best.length > 0;
  const hasLatest = channel.latest.length > 0;
  const [mode, setMode] = useState<"latest" | "best">(hasBest ? "best" : "latest");
  const videos = mode === "best" ? channel.best : channel.latest;

  return (
    <article className="ch-card">
      <div className="ch-main">
        <div className="ch-meta">
          <a
            className="ch-name"
            href={`https://www.youtube.com/@${channel.handle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {channel.name}
          </a>
          <div className="ch-chips">
            <span className="ch-chip">{channel.level}</span>
            <span className="ch-chip">{channel.format}</span>
          </div>
          <p className="ch-best">{channel.bestFor}</p>
          <p className="ch-skip">{channel.skip}</p>
        </div>
      </div>

      {(hasLatest || hasBest) && (
        <div className="ch-videos">
          <div className="ch-videos-head">
            {hasBest && hasLatest ? (
              <div className="ch-toggle" role="tablist">
                <button
                  type="button"
                  className={mode === "latest" ? "active" : ""}
                  onClick={() => setMode("latest")}
                >
                  Latest
                </button>
                <button
                  type="button"
                  className={mode === "best" ? "active" : ""}
                  onClick={() => setMode("best")}
                >
                  Best
                </button>
              </div>
            ) : (
              <div className="ch-videos-label">{hasBest ? "Best videos" : "Latest videos"}</div>
            )}
          </div>

          {videos.map((v) => (
            <div className="ch-video" key={v.videoId}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumbnail} alt="" loading="lazy" width={120} height={68} />
              <div className="ch-video-body">
                <div className="ch-video-title">{v.title}</div>
                {v.subtitle && <div className="ch-video-date">{v.subtitle}</div>}
                <button
                  type="button"
                  className="ch-video-cta"
                  onClick={() => onPlay(v.videoId)}
                >
                  Get transcript &amp; insights →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
