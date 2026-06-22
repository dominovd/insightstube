import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import TranscriptTool from "@/components/TranscriptTool";
import { IconCheck, IconGlobe, IconDownload, IconSparkles } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Translate YouTube Transcript Online | InsightsTube",
  description:
    "Translate YouTube transcripts into 30+ languages while keeping timestamps. Paste a YouTube link, get the transcript, translate it, and download TXT, SRT or VTT.",
  alternates: { canonical: "/translate-youtube-transcript" },
  openGraph: {
    title: "Translate YouTube Transcript Online",
    description:
      "Paste a YouTube link, generate the transcript, translate it into another language, and keep timestamps for notes or subtitles.",
    url: "https://insightstube.com/translate-youtube-transcript",
    type: "website",
  },
};

const faq = [
  {
    q: "Can I translate a YouTube transcript online?",
    a: "Yes. Paste a YouTube link, generate the transcript, choose a target language, and translate the transcript while keeping the original timestamps.",
  },
  {
    q: "Does the translation keep timestamps?",
    a: "Yes. InsightsTube keeps the transcript timing, so translated text can still be copied with timestamps or exported for subtitle workflows.",
  },
  {
    q: "Can I download a translated transcript?",
    a: "Yes. After translation, you can copy the translated transcript or download it as TXT, SRT or VTT.",
  },
  {
    q: "What languages are supported?",
    a: "InsightsTube supports common target languages such as Spanish, French, German, Portuguese, Russian, Ukrainian, Arabic, Hindi, Chinese, Japanese, Korean and more.",
  },
  {
    q: "What if the video has no captions?",
    a: "InsightsTube needs an available YouTube caption track to generate a transcript. If a video has no captions, translation may not be available.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Translate YouTube Transcript Online",
      url: "https://insightstube.com/translate-youtube-transcript",
      description:
        "Translate YouTube transcripts into multiple languages while keeping timestamps and export formats.",
      isPartOf: { "@id": "https://insightstube.com/#website" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div className="badge">
            <span className="dot"></span>YouTube transcript translator · Timestamps · No signup
          </div>
          <h1>
            Translate any <span className="grad">YouTube transcript</span>
          </h1>
          <p className="sub">
            Paste a YouTube link, get the transcript, translate it into another
            language, and keep timestamps for notes, subtitles, research or AI tools.
          </p>

          <TranscriptTool ctaLabel="Get transcript & translate →" />

          <div className="hero-meta">
            <span>
              <IconCheck size={15} />
              Translate to 30+ languages
            </span>
            <span>
              <IconCheck size={15} />
              Keep timestamps
            </span>
            <span>
              <IconCheck size={15} />
              Copy translated text
            </span>
            <span>
              <IconCheck size={15} />
              Export TXT · SRT · VTT
            </span>
          </div>
        </div>
      </header>

      <section>
        <div className="wrap center">
          <div className="sec-label">How it works</div>
          <h2>From YouTube link to translated transcript in three steps</h2>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Paste a YouTube link</h3>
              <p>Add any public YouTube video with available captions or subtitles.</p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Generate the transcript</h3>
              <p>Get clean text with timestamps, then choose your target language.</p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Translate and export</h3>
              <p>Copy translated text or download subtitle-friendly TXT, SRT and VTT files.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tinted">
        <div className="wrap center">
          <div className="sec-label">Use cases</div>
          <h2>Translate transcripts for subtitles, study and AI workflows</h2>
          <p className="sec-sub">
            Keep timestamps when you need citations or subtitles. Remove them when you
            want clean translated notes.
          </p>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-ic ic-amber">
                <IconGlobe size={22} />
              </div>
              <h3>Language learning</h3>
              <p>Compare the original transcript with translated lines and review important phrases.</p>
            </div>
            <div className="tool-card">
              <div className="tool-ic ic-green">
                <IconDownload size={22} />
              </div>
              <h3>Translated subtitles</h3>
              <p>Keep timing intact for subtitle editing workflows with SRT and VTT exports.</p>
            </div>
            <div className="tool-card">
              <div className="tool-ic ic-violet">
                <IconSparkles size={22} />
              </div>
              <h3>AI summaries</h3>
              <p>Translate the transcript first, then summarize, extract takeaways or chat with it.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap center">
          <div className="sec-label">FAQ</div>
          <h2>Questions, answered</h2>
          <div className="faq">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="final-cta">
            <h2>Translate a YouTube transcript now</h2>
            <p>Paste a link, generate the transcript, choose a language, and keep timestamps.</p>
            <Link className="btn-main" href="#top" style={{ position: "relative" }}>
              Translate transcript →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
