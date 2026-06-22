import Link from "next/link";
import { IconPlay } from "./Icons";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" href="/" style={{ marginBottom: 12 }}>
              <span className="logo-mark">
                <IconPlay size={15} />
              </span>
              <span>
                Insights<b>Tube</b>
              </span>
            </Link>
            <p style={{ maxWidth: 260 }}>
              InsightsTube turns YouTube videos into transcripts, subtitles, summaries
              and AI insights. Free tools for people who learn from video.
            </p>
          </div>
          <div>
            <h4>Tools</h4>
            <Link href="/#top">Transcript Generator</Link>
            <Link href="/chat-with-youtube-transcript">Chat with YouTube Transcript</Link>
            <Link href="/#top">AI Summarizer</Link>
            <Link href="/#top">Subtitle Downloader</Link>
            <Link href="/translate-youtube-transcript">Transcript Translator</Link>
          </div>
          <div>
            <h4>Guides</h4>
            <Link href="/guides/how-to-get-youtube-transcript">YouTube transcripts</Link>
            <Link href="/guides/how-to-get-insights-from-youtube-video">Video insights</Link>
            <Link href="/guides/how-to-summarize-youtube-video-with-ai-free">AI summaries</Link>
            <Link href="/guides">All guides</Link>
          </div>
          <div>
            <h4>Site</h4>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="foot-note">
          <span>© 2026 InsightsTube · Not affiliated with YouTube or Google LLC</span>
        </div>
      </div>
    </footer>
  );
}
