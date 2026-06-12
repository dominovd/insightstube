import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About — InsightsTube",
  description:
    "What InsightsTube is, why we built it, and how our free YouTube transcript and AI summary tools work.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <SiteNav />
      <main className="page">
        <h1>About InsightsTube</h1>
        <p className="page-sub">Free tools for people who learn from video.</p>

        <p>
          InsightsTube turns YouTube videos into text you can actually work with: full
          transcripts with clickable timestamps, downloadable subtitle files, and
          AI-generated summaries with key takeaways.
        </p>
        <p>
          We built it for a simple reason: more and more knowledge lives inside
          long-form video — lectures, podcasts, interviews, tutorials — but video is a
          terrible format for finding one quote, citing a source, or deciding whether
          a two-hour episode is worth your time. Text solves all of that.
        </p>

        <h2>How it works</h2>
        <p>
          When you paste a link, we read the caption track that YouTube already
          publishes for that video — either the creator&apos;s own subtitles or
          YouTube&apos;s automatic captions. We never download, copy or store the
          video or audio itself. AI summaries are generated on demand from the
          transcript text using Anthropic&apos;s Claude model.
        </p>

        <h2>What we believe</h2>
        <ul>
          <li>Useful single-purpose tools should be free and work without an account.</li>
          <li>Your data is not the product: we don&apos;t build profiles or sell data.</li>
          <li>Creators own their content — we only work with the public caption text.</li>
        </ul>

        <h2>Who is behind this</h2>
        <p>
          InsightsTube is an independent project by the team behind{" "}
          <a href="https://seocheck.tools">SEO Check Tools</a>, a free YouTube SEO
          toolkit for creators. InsightsTube is the other side of the same coin: tools
          for the people who watch.
        </p>
        <p>
          Questions or ideas? <a href="/contact">Get in touch</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
