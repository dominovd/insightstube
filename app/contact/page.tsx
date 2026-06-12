import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact — InsightsTube",
  description: "Get in touch with the InsightsTube team.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <SiteNav />
      <main className="page">
        <h1>Contact</h1>
        <p className="page-sub">We read everything. Usually we reply within 1–2 business days.</p>

        <div className="contact-card">
          <span className="ic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="m2 7 10 6 10-6" />
            </svg>
          </span>
          <div>
            <a href="mailto:info@insightstube.com">info@insightstube.com</a>
            <div className="hint">Support, feedback, partnerships and press</div>
          </div>
        </div>

        <h2>Before you write</h2>
        <ul>
          <li>
            <b>A video has no transcript?</b> If the creator disabled captions and
            YouTube has no auto-captions, there is no caption track for us to read —
            no tool can fetch what doesn&apos;t exist.
          </li>
          <li>
            <b>Found a bug?</b> Include the video URL and what you expected to happen —
            that makes fixes much faster.
          </li>
          <li>
            <b>Content removal:</b> we don&apos;t host videos or audio; transcripts are
            fetched on demand from YouTube&apos;s public caption tracks and are not
            stored. For content issues, please contact YouTube directly.
          </li>
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
