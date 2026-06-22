import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { guides } from "@/lib/guides";
import { IconTranscript, IconSparkles, IconList } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Guides | InsightsTube",
  description:
    "Practical guides on YouTube transcripts, AI summaries and video insights: how to get transcripts, extract key takeaways and summarize long videos.",
  alternates: { canonical: "/guides" },
};

const icons = {
  transcript: IconTranscript,
  sparkles: IconSparkles,
  list: IconList,
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
          {guides.map((guide) => {
            const Icon = icons[guide.icon];
            return (
              <Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}>
                <div className={`guide-img ${guide.gradient}`}>
                  <Icon size={38} />
                </div>
                <div className="guide-body">
                  <div className="guide-tag">{guide.tag}</div>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
