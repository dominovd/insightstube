import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How to Use a YouTube Transcript with ChatGPT or Claude",
  description:
    "Learn how to use a YouTube transcript with ChatGPT, Claude or Gemini to summarize videos, create study notes, extract quotes and ask questions.",
  alternates: { canonical: "/guides/how-to-use-youtube-transcript-with-chatgpt-claude" },
  openGraph: {
    title: "How to Use a YouTube Transcript with ChatGPT or Claude",
    description:
      "Copy a YouTube transcript into ChatGPT, Claude or Gemini and turn long videos into summaries, notes, quotes and action items.",
    type: "article",
    url: "https://insightstube.com/guides/how-to-use-youtube-transcript-with-chatgpt-claude",
  },
};

const faq = [
  {
    q: "Can ChatGPT summarize a YouTube transcript?",
    a: "Yes. Copy the YouTube transcript and paste it into ChatGPT with a clear prompt. Ask for a short summary, key takeaways, timestamps, quotes or study notes.",
  },
  {
    q: "Can Claude analyze long YouTube transcripts?",
    a: "Claude is useful for longer transcripts because it can work with large amounts of text. For very long videos, split the transcript into sections or use a transcript tool with built-in AI chat.",
  },
  {
    q: "Should I keep timestamps when using AI?",
    a: "Keep timestamps when you need citations, quotes or links back to exact moments. Remove timestamps when you only need clean notes or a rewritten article.",
  },
  {
    q: "What is the best prompt for a YouTube transcript?",
    a: "The best prompt states the output you want, the audience, the level of detail and whether timestamps should be included.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Use a YouTube Transcript with ChatGPT or Claude",
      description:
        "Learn how to use a YouTube transcript with ChatGPT, Claude or Gemini to summarize videos, create study notes, extract quotes and ask questions.",
      datePublished: "2026-06-22",
      dateModified: "2026-06-22",
      author: { "@type": "Organization", name: "InsightsTube" },
      publisher: { "@type": "Organization", name: "InsightsTube", url: "https://insightstube.com" },
      mainEntityOfPage:
        "https://insightstube.com/guides/how-to-use-youtube-transcript-with-chatgpt-claude",
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
        {
          "@type": "ListItem",
          position: 2,
          name: "How to Use a YouTube Transcript with ChatGPT or Claude",
        },
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
          <Link href="/guides">Guides</Link> / AI Prompts
        </div>
        <span className="g-cat">AI Prompts</span>
        <h1>How to Use a YouTube Transcript with ChatGPT or Claude</h1>
        <p className="lead">
          A YouTube transcript is one of the easiest ways to use AI with a video.
          Instead of asking ChatGPT, Claude or Gemini to guess what happened, give it
          the actual text of the video and ask for the output you need.
        </p>

        <h2>Step 1: Get the YouTube transcript</h2>
        <p>
          Start by copying the video URL and generating the transcript. Keep
          timestamps if you want quotes, citations or links back to exact moments in
          the video. Remove timestamps if you only need clean notes, a rewrite or a
          blog outline.
        </p>
        <p>
          With <Link href="/">InsightsTube</Link>, paste a YouTube link, generate the
          transcript, then copy the text or use the built-in AI summary and chat tabs.
        </p>

        <Cta
          title="Turn a video into an AI-ready transcript"
          sub="Paste a YouTube link, copy the transcript, or summarize it directly with InsightsTube."
        />

        <h2>Step 2: Paste the transcript into ChatGPT, Claude or Gemini</h2>
        <p>
          Put your instruction before the transcript. This gives the AI a clear task
          before it reads the video text. For long transcripts, ask for a structured
          answer instead of a vague summary.
        </p>

        <figure className="g-fig">
          <div className="g-prompt">
            <span className="ph">Prompt</span>
{`You are analyzing a YouTube transcript.

Create:
1. A 5-bullet summary
2. The 10 most important takeaways
3. The best quotes with timestamps
4. Action items I can use after watching

Here is the transcript:
[paste transcript here]`}
          </div>
          <figcaption>A reusable prompt for summarizing and extracting useful ideas from a video</figcaption>
        </figure>

        <h2>Best prompts for YouTube transcripts</h2>
        <p>Use different prompts depending on the job you want the AI to do.</p>
        <table className="g-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Prompt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Summary</td>
              <td>Summarize this YouTube transcript in 5 bullet points and include the most useful timestamps.</td>
            </tr>
            <tr>
              <td>Study notes</td>
              <td>Turn this transcript into study notes with headings, key concepts and 10 quiz questions.</td>
            </tr>
            <tr>
              <td>Research</td>
              <td>Extract the main claims, supporting examples and quotable lines with timestamps.</td>
            </tr>
            <tr>
              <td>Content repurposing</td>
              <td>Convert this transcript into a blog outline, newsletter intro and 5 social posts.</td>
            </tr>
          </tbody>
        </table>

        <h2>Step 3: Ask follow-up questions</h2>
        <p>
          Once the AI understands the transcript, use follow-up questions to go
          deeper. Ask what the speaker said about a specific topic, where the strongest
          evidence appears, or which moments are worth rewatching.
        </p>
        <p>Good follow-up questions include:</p>
        <ul>
          <li>What is the main argument of this video?</li>
          <li>Which timestamps contain the most important ideas?</li>
          <li>What would a beginner misunderstand?</li>
          <li>Turn this tutorial into a step-by-step checklist.</li>
          <li>Find the strongest quote and explain why it matters.</li>
        </ul>

        <h2>When to use built-in transcript chat instead</h2>
        <p>
          Copying into ChatGPT or Claude works well, but it can get clumsy when you
          need repeated questions, clickable timestamps or a quick answer while
          reviewing the video. In that case, use a transcript chat tool that keeps the
          transcript, summary and Q&amp;A in the same workspace.
        </p>

        <div className="faq">
          {faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <RelatedGuides current="how-to-use-youtube-transcript-with-chatgpt-claude" />
      </main>
      <SiteFooter />
    </>
  );
}
