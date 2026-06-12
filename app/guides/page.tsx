import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { IconTranscript, IconSparkles, IconList } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Guides | InsightsTube",
  description:
    "Practical guides on YouTube transcripts, AI summaries and video insights: how to get transcripts, extract key takeaways and summarize long videos.",
  alternates: { canonical: "/guides" },
};

export default function Guides() {
  return (
    <>
      <SiteNav />
      <main className="g-index">
        <h1>Guides</h1>
        <p className="sub">
          Practical, no-fluff guides on getting transcripts, summaries and useful
          insights out of YouTube videos.
        </p>
        <div className="guides">
          <Link className="guide-card" href="/guides/how-to-get-youtube-transcript">
            <div className="guide-img gi-1">
              <IconTranscript size={38} />
            </div>
            <div className="guide-body">
              <div className="guide-tag">Transcripts</div>
              <h3>How to Get the Transcript of Any YouTube Video</h3>
              <p>Built-in transcripts, one-click tools and what to do when captions are disabled.</p>
            </div>
          </Link>
          <Link className="guide-card" href="/guides/how-to-get-insights-from-youtube-video">
            <div className="guide-img gi-2">
              <IconSparkles size={38} />
            </div>
            <div className="guide-body">
              <div className="guide-tag">Insights</div>
              <h3>How to Get Insights from a YouTube Video</h3>
              <p>Use transcripts, summaries and timestamps to pull out the ideas that matter.</p>
            </div>
          </Link>
          <Link className="guide-card" href="/guides/how-to-summarize-youtube-video-with-ai-free">
            <div className="guide-img gi-3">
              <IconList size={38} />
            </div>
            <div className="guide-body">
              <div className="guide-tag">AI Summaries</div>
              <h3>How to Summarize a YouTube Video with AI for Free</h3>
              <p>Turn a long podcast, lecture or tutorial into a short readable summary with key takeaways.</p>
            </div>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
