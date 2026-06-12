import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import TranscriptTool from "@/components/TranscriptTool";
import { IconCheck, IconGraduation, IconMicroscope, IconPen, IconBriefcase } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Chat with YouTube Transcript: Ask Questions About Any Video | InsightsTube",
  description:
    "Paste a YouTube link, get the transcript, and chat with the video. Ask questions, find key moments, extract quotes, summaries and insights with timestamps.",
  alternates: { canonical: "/chat-with-youtube-transcript" },
  openGraph: {
    title: "Chat with YouTube Transcript: Ask Questions About Any Video",
    description:
      "Paste a YouTube link, get the transcript, and ask the video what matters. Answers with timestamps, quotes and key takeaways.",
    url: "https://insightstube.com/chat-with-youtube-transcript",
    type: "website",
  },
};

const faq = [
  {
    q: "What is transcript chat?",
    a: "Transcript chat lets you ask questions about a YouTube video using its transcript. Instead of watching the full video, you can get answers, summaries, quotes and timestamps from the text.",
  },
  {
    q: "Can I chat with any YouTube video?",
    a: "You can chat with videos that have available captions or transcripts. If a video has no captions, the transcript may not be available.",
  },
  {
    q: "Are the answers based on the actual video?",
    a: "Yes. The chat uses the video transcript, so answers are based on what was said in the video. For quotes or important facts, always check the timestamp.",
  },
  {
    q: "Can I get timestamps in the answers?",
    a: "Yes. Transcript chat is most useful when answers include timestamps, because you can jump back to the exact moment in the video.",
  },
  {
    q: "Is it free?",
    a: "You can generate YouTube transcripts for free. AI chat and insights may have fair-use limits to keep the tool available and fast.",
  },
  {
    q: "Do I need to sign up?",
    a: "No signup is needed to start with a transcript. Some advanced AI features may have limits depending on usage.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Chat with YouTube Transcript",
      url: "https://insightstube.com/chat-with-youtube-transcript",
      description:
        "Paste a YouTube link, get the transcript, and chat with the video. Answers with timestamps, quotes and key takeaways.",
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

const exampleQuestions = [
  "What is the main idea of this video?",
  "Summarize the video in 5 bullet points.",
  "What are the key takeaways?",
  "Find the best quote about productivity.",
  "What does the speaker say about pricing?",
  "Show me the most important timestamps.",
  "Turn this tutorial into a step-by-step checklist.",
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div className="badge">
            <span className="dot"></span>YouTube transcript chat · AI insights · Timestamps
          </div>
          <h1>
            Chat with any <span className="grad">YouTube transcript</span>
          </h1>
          <p className="sub">
            Paste a YouTube link, get the full transcript, and ask questions about the
            video. Find key moments, pull quotes, summarize ideas, and get answers
            with timestamps.
          </p>

          <TranscriptTool defaultTab="chat" ctaLabel="Get transcript & start chat →" />

          <div className="hero-meta" style={{ marginTop: 14 }}>
            <span style={{ color: "var(--ink-3)" }}>
              Works with public YouTube videos that have captions. No signup needed.
            </span>
          </div>

          <div className="hero-meta">
            <span>
              <IconCheck size={15} />
              Ask questions about the video
            </span>
            <span>
              <IconCheck size={15} />
              Answers from the transcript
            </span>
            <span>
              <IconCheck size={15} />
              Quotes with timestamps
            </span>
            <span>
              <IconCheck size={15} />
              Summaries &amp; key insights
            </span>
          </div>
        </div>
      </header>

      <section>
        <div className="wrap center">
          <div className="sec-label">How it works</div>
          <h2>From YouTube link to transcript chat in seconds</h2>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Paste a YouTube link</h3>
              <p>
                Add any public YouTube video with available captions: podcasts,
                lectures, tutorials, webinars, interviews or reviews.
              </p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Generate the transcript</h3>
              <p>
                InsightsTube turns the video into clean, searchable text with
                clickable timestamps.
              </p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Ask the transcript</h3>
              <p>
                Chat with the video to find answers, key takeaways, quotes, action
                items and important moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tinted">
        <div className="wrap center">
          <div className="sec-label">Transcript chat</div>
          <h2>Ask the video anything</h2>
          <p className="sec-sub">
            Instead of rewatching a long video, ask direct questions and get answers
            based on the transcript.
          </p>
          <div className="q-chips">
            {exampleQuestions.map((q) => (
              <span className="q-chip" key={q}>
                {q}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="sec-label">Use cases</div>
          <h2>Use transcript chat when watching takes too long</h2>
          <div className="aud">
            <div className="aud-card">
              <div className="aud-ic">
                <IconGraduation size={20} />
              </div>
              <h3>Students</h3>
              <p>Ask lecture transcripts for definitions, examples, study notes and exam-friendly summaries.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconMicroscope size={20} />
              </div>
              <h3>Researchers</h3>
              <p>Find claims, quotes, themes and timestamped evidence inside interviews or talks.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconPen size={20} />
              </div>
              <h3>Writers &amp; journalists</h3>
              <p>Pull accurate quotes and context from podcasts, press events and long-form videos.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconBriefcase size={20} />
              </div>
              <h3>Professionals</h3>
              <p>Turn webinars, demos and training videos into action items, summaries and decisions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tinted">
        <div className="wrap center">
          <div className="sec-label">Why it works</div>
          <h2>A transcript makes AI answers more useful</h2>
          <p className="sec-sub">
            When AI works from the transcript, it can answer based on what was
            actually said in the video. That means better summaries, clearer insights
            and easier verification with timestamps.
          </p>
          <div className="free-list">
            <span><IconCheck size={15} /> Grounded in the video transcript</span>
            <span><IconCheck size={15} /> Timestamped answers</span>
            <span><IconCheck size={15} /> Less guessing from the title alone</span>
            <span><IconCheck size={15} /> Easy quote checking</span>
            <span><IconCheck size={15} /> Better summaries for long videos</span>
            <span><IconCheck size={15} /> Free transcript to start</span>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <h2>Watch less. Understand more.</h2>
          <div className="g-cmp" style={{ maxWidth: 880, margin: "36px auto 0", textAlign: "left" }}>
            <div className="side bad">
              <div className="lbl">Without transcript chat</div>
              <p>
                Rewatch the same sections. Search manually through the timeline. Miss
                important quotes. Take messy notes. Forget where an idea appeared.
              </p>
            </div>
            <div className="side good">
              <div className="lbl">With transcript chat</div>
              <p>
                Ask direct questions. Jump to exact timestamps. Copy useful quotes.
                Extract key takeaways. Save clean notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="tinted">
        <div className="wrap center">
          <div className="sec-label">FAQ</div>
          <h2>Questions, answered</h2>
          <div className="faq">
            {faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: 14, color: "var(--ink-2)" }}>
            New to transcripts? Start with our guide on{" "}
            <Link href="/guides/how-to-get-youtube-transcript" style={{ color: "var(--accent)" }}>
              how to get the transcript of any YouTube video
            </Link>{" "}
            or learn{" "}
            <Link href="/guides/how-to-get-insights-from-youtube-video" style={{ color: "var(--accent)" }}>
              how to extract insights from a video
            </Link>
            .
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="final-cta">
            <h2>Turn a YouTube video into a conversation</h2>
            <p>Paste a link, get the transcript, and ask the video what matters. Free to start, no signup needed.</p>
            <a className="btn-main" href="#top" style={{ position: "relative" }}>
              Chat with a transcript →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
