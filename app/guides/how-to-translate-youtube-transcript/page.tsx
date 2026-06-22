import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How to Translate a YouTube Transcript",
  description:
    "Learn how to translate a YouTube transcript with AI, keep timestamps, choose the right format, and use translated text for subtitles, study notes or research.",
  alternates: { canonical: "/guides/how-to-translate-youtube-transcript" },
  openGraph: {
    title: "How to Translate a YouTube Transcript",
    description:
      "A practical workflow for translating YouTube transcripts with AI while keeping timestamps and clean formatting.",
    type: "article",
    url: "https://insightstube.com/guides/how-to-translate-youtube-transcript",
  },
};

const faq = [
  {
    q: "Can I translate a YouTube transcript for free?",
    a: "Yes. Generate the YouTube transcript, copy the text, then translate it with an AI assistant or translation tool. The quality depends on the transcript and the translation model.",
  },
  {
    q: "Can I keep timestamps while translating?",
    a: "Yes. Keep timestamps in the transcript and tell the AI to preserve each timestamp while translating only the spoken text.",
  },
  {
    q: "What format is best for translated subtitles?",
    a: "Use SRT or VTT if you need subtitle timing. Use TXT if you only need readable translated notes or a summary.",
  },
  {
    q: "Can I translate auto-generated YouTube captions?",
    a: "Yes, but errors in auto-generated captions can carry into the translation. For important work, review names, technical terms and quotes.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Translate a YouTube Transcript",
      description:
        "Learn how to translate a YouTube transcript with AI, keep timestamps, choose the right format, and use translated text for subtitles, study notes or research.",
      datePublished: "2026-06-22",
      dateModified: "2026-06-22",
      author: { "@type": "Organization", name: "InsightsTube" },
      publisher: { "@type": "Organization", name: "InsightsTube", url: "https://insightstube.com" },
      mainEntityOfPage: "https://insightstube.com/guides/how-to-translate-youtube-transcript",
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Guides", item: "https://insightstube.com/guides" },
        { "@type": "ListItem", position: 2, name: "How to Translate a YouTube Transcript" },
      ],
    },
  ],
};

function Cta({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="g-cta">
      <div>
        <div className="t">{title}</div>
        <div className="s">{sub}</div>
      </div>
      <Link className="btn-main" href="/#top">
        Get transcript &amp; insights →
      </Link>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main className="g-article">
        <div className="g-crumbs">
          <Link href="/guides">Guides</Link> / Translation
        </div>
        <span className="g-cat">Translation</span>
        <h1>How to Translate a YouTube Transcript</h1>
        <p className="lead">
          Translating a YouTube video is easier when you start with the transcript.
          Instead of translating audio directly, turn the video into text, keep the
          timestamps you need, then translate the transcript into your target language.
        </p>

        <h2>Step 1: Generate the YouTube transcript</h2>
        <p>
          Copy the YouTube URL and paste it into a transcript generator. If the video
          has captions, you can get clean text with timestamps and export it as TXT,
          SRT or VTT.
        </p>
        <p>
          Keep timestamps if you want translated subtitles, citations or links back to
          exact moments. Remove timestamps if you only need translated notes.
        </p>

        <Cta
          title="Get the transcript before you translate"
          sub="Paste a YouTube link, copy clean text, or download TXT, SRT and VTT files."
        />

        <h2>Step 2: Choose the right translation workflow</h2>
        <p>The best workflow depends on your goal:</p>
        <table className="g-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Best format</th>
              <th>What to do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Readable notes</td>
              <td>TXT</td>
              <td>Copy the transcript and ask AI to translate it into natural language.</td>
            </tr>
            <tr>
              <td>Subtitles</td>
              <td>SRT or VTT</td>
              <td>Preserve each timestamp and translate only the caption text.</td>
            </tr>
            <tr>
              <td>Research</td>
              <td>TXT with timestamps</td>
              <td>Translate while keeping timestamps for quotes and citations.</td>
            </tr>
            <tr>
              <td>Language learning</td>
              <td>TXT</td>
              <td>Ask for side-by-side original and translated lines.</td>
            </tr>
          </tbody>
        </table>

        <h2>Step 3: Use an AI translation prompt</h2>
        <p>
          AI tools such as ChatGPT, Claude and Gemini can translate a transcript and
          preserve structure if you give them clear instructions.
        </p>

        <figure className="g-fig">
          <div className="g-prompt">
            <span className="ph">Prompt</span>
{`Translate this YouTube transcript into Spanish.

Rules:
- Keep every timestamp unchanged
- Translate only the spoken text
- Keep names, brands and technical terms accurate
- Make the translation natural, not literal

Transcript:
[paste transcript here]`}
          </div>
          <figcaption>A prompt for translating a transcript while preserving timestamps</figcaption>
        </figure>

        <h2>Step 4: Review names, quotes and technical terms</h2>
        <p>
          Translation quality depends on the original captions. Human captions usually
          translate better than auto-generated captions. If the video includes names,
          product terms, acronyms, numbers or quotes, review those lines before using
          the translation publicly.
        </p>

        <figure className="g-fig">
          <div className="g-cmp">
            <div className="side bad">
              <div className="lbl">Avoid</div>
              <p>Translating the whole transcript as one unstructured block and losing timestamps.</p>
            </div>
            <div className="side good">
              <div className="lbl">Better</div>
              <p>Translate section by section, preserve timestamps, then review important terms.</p>
            </div>
          </div>
          <figcaption>A safer workflow for translated transcripts and subtitles</figcaption>
        </figure>

        <h2>Can you translate YouTube subtitles directly?</h2>
        <p>
          Sometimes YouTube offers translated caption tracks directly on the video.
          When they are available, they are convenient for watching. But if you need
          clean text, subtitle files, study notes or AI summaries, exporting the
          transcript first gives you more control.
        </p>

        <div className="faq">
          {faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <RelatedGuides current="how-to-translate-youtube-transcript" />
      </main>
      <SiteFooter />
    </>
  );
}
