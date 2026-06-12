import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "How to Get the Transcript of Any YouTube Video",
  description:
    "Learn how to get a YouTube transcript using YouTube's built-in transcript panel, a free transcript generator, or subtitle files. Includes fixes for videos with no captions.",
  alternates: { canonical: "/guides/how-to-get-youtube-transcript" },
  openGraph: {
    title: "How to Get the Transcript of Any YouTube Video",
    description:
      "Three practical ways to get a YouTube transcript, copy it, download it, and handle videos with missing captions.",
    type: "article",
    url: "https://insightstube.com/guides/how-to-get-youtube-transcript",
  },
};

const faq = [
  {
    q: "Can I get a transcript of any YouTube video?",
    a: "You can get a transcript when captions are available for the video. If the creator disabled captions or YouTube has no automatic captions, a transcript may not be available.",
  },
  {
    q: "How do I download a YouTube transcript?",
    a: "Paste the video link into a YouTube transcript tool and choose a download format such as TXT, SRT, or VTT. TXT is best for reading, while SRT and VTT are best for subtitles.",
  },
  {
    q: "Can I get a YouTube transcript for free?",
    a: "Yes. YouTube's built-in transcript is free, and tools like InsightsTube can generate free transcripts from videos with available captions.",
  },
  {
    q: "Why does the transcript not appear on YouTube?",
    a: "The video may not have captions, automatic captions may be unavailable, or the video may be restricted. Try checking for the CC button or opening the video on desktop.",
  },
  {
    q: "Is a transcript the same as subtitles?",
    a: "Not exactly. A transcript is the full text of the video. Subtitles are timed caption files, usually in formats such as SRT or VTT.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "How to Get the Transcript of Any YouTube Video",
      description:
        "Three practical ways to get a YouTube transcript, copy it, download it, and handle videos with missing captions.",
      author: { "@type": "Organization", name: "InsightsTube" },
      publisher: { "@type": "Organization", name: "InsightsTube", url: "https://insightstube.com" },
      mainEntityOfPage: "https://insightstube.com/guides/how-to-get-youtube-transcript",
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
        { "@type": "ListItem", position: 2, name: "How to Get the Transcript of Any YouTube Video" },
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
          <Link href="/guides">Guides</Link> / Transcripts
        </div>
        <span className="g-cat">Transcripts</span>
        <h1>How to Get the Transcript of Any YouTube Video</h1>
        <p className="lead">
          A YouTube transcript turns a video into searchable text. Instead of
          scrubbing through a lecture, podcast, interview, tutorial, or webinar, you
          can scan the words, copy a quote, find a timestamp, or turn the video into
          notes.
        </p>
        <p>There are three reliable ways to get a YouTube transcript:</p>
        <ol>
          <li>Use YouTube's built-in transcript panel.</li>
          <li>Use a free YouTube transcript generator.</li>
          <li>Download subtitles as TXT, SRT, or VTT.</li>
        </ol>
        <p>
          The best option depends on what you need. If you only want to read a few
          lines, YouTube's built-in transcript is usually enough. If you want clean
          text, downloadable files, timestamps, or AI insights, a transcript tool is
          faster.
        </p>

        <figure className="g-fig">
          <div className="g-choose">
            <div className="opt">
              <div className="need">Need to quickly check a few lines or find a quote?</div>
              <div className="arrow">↓</div>
              <div className="method">YouTube's built-in transcript panel</div>
            </div>
            <div className="opt">
              <div className="need">Need clean text, downloads, timestamps or AI insights?</div>
              <div className="arrow">↓</div>
              <div className="method">Free transcript generator</div>
            </div>
            <div className="opt">
              <div className="need">Need caption files for editing or another platform?</div>
              <div className="arrow">↓</div>
              <div className="method">Download SRT / VTT subtitles</div>
            </div>
          </div>
          <figcaption>Which method to choose, depending on your goal</figcaption>
        </figure>

        <h2>Method 1: Use YouTube's Built-In Transcript</h2>
        <p>
          YouTube often creates captions automatically, and many creators upload their
          own subtitles. When captions are available, YouTube can show the full
          transcript beside the video.
        </p>
        <p>To open it on desktop:</p>
        <ol>
          <li>Open the YouTube video.</li>
          <li>Click the three-dot menu under the video.</li>
          <li>Select <b>Show transcript</b>.</li>
          <li>The transcript will appear next to the video.</li>
          <li>Click any timestamp to jump to that part of the video.</li>
        </ol>

        <figure className="g-fig">
          <div className="g-yt">
            <div>
              <div className="player"></div>
              <div className="under">
                <div className="pill"></div>
                <div className="dots">⋯</div>
              </div>
              <div className="menu">
                <div>Save</div>
                <div>Report</div>
                <div className="hl">Show transcript</div>
              </div>
            </div>
            <div className="panel">
              <div className="ph">Transcript</div>
              <div className="prow"><span className="pt">00:00</span><span>welcome back to the channel, today we are</span></div>
              <div className="prow"><span className="pt">00:04</span><span>going to look at three different ways to</span></div>
              <div className="prow"><span className="pt">00:08</span><span>work with long videos and the first one</span></div>
              <div className="prow"><span className="pt">00:13</span><span>is the most overlooked: the transcript</span></div>
              <div className="prow"><span className="pt">00:18</span><span>panel that already exists on YouTube</span></div>
            </div>
          </div>
          <figcaption>
            The three-dot menu under the video opens the built-in transcript panel with clickable timestamps
          </figcaption>
        </figure>

        <p>
          This is useful when you want to quickly search within a video or verify a
          quote. You can also use your browser's find command to search for a word or
          phrase inside the transcript panel.
        </p>

        <h2>Method 2: Use a Free YouTube Transcript Generator</h2>
        <p>
          If you want a cleaner result, paste the video link into a free YouTube
          transcript generator such as <Link href="/">InsightsTube</Link>.
        </p>
        <p>The workflow is simple:</p>
        <ol>
          <li>Copy the YouTube video URL.</li>
          <li>Paste it into the transcript tool.</li>
          <li>Generate the transcript.</li>
          <li>Copy the text or download it.</li>
          <li>Use timestamps to jump back to important moments.</li>
        </ol>
        <p>
          This is usually better than the built-in YouTube panel if you need to reuse
          the transcript for research, writing, study notes, content repurposing, or
          editing. A good transcript tool keeps the text readable and gives you export
          options, so you are not stuck manually copying from YouTube.
        </p>

        <Cta
          title="Try it on any YouTube video"
          sub="Paste a link, get the transcript with timestamps, download TXT, SRT or VTT. Free, no signup."
        />

        <h2>Method 3: Download YouTube Subtitles</h2>
        <p>
          Sometimes you do not need plain text. You may need a subtitle file for
          editing, uploading to another platform, translation, or video production. In
          that case, download the captions as SRT or VTT.
        </p>

        <figure className="g-fig">
          <div className="g-fmt">
            <div className="file">
              <div className="fname">transcript<span className="ext e-txt">TXT</span></div>
              <pre>{`[00:12] The first thing
most people get wrong
is skipping the research
step entirely.

[00:25] Start with what
your audience already
searches for.`}</pre>
              <div className="best"><b>Best for:</b> reading, notes, quotes, summaries</div>
            </div>
            <div className="file">
              <div className="fname">captions<span className="ext e-srt">SRT</span></div>
              <pre>{`1
00:00:12,000 --> 00:00:16,200
The first thing most
people get wrong

2
00:00:16,200 --> 00:00:19,800
is skipping the research
step entirely.`}</pre>
              <div className="best"><b>Best for:</b> video editors, subtitle uploads</div>
            </div>
            <div className="file">
              <div className="fname">captions<span className="ext e-vtt">VTT</span></div>
              <pre>{`WEBVTT

00:00:12.000 --> 00:00:16.200
The first thing most
people get wrong

00:00:16.200 --> 00:00:19.800
is skipping the research
step entirely.`}</pre>
              <div className="best"><b>Best for:</b> web players, caption workflows</div>
            </div>
          </div>
          <figcaption>The same fragment in three formats: TXT for reading, SRT and VTT for caption workflows</figcaption>
        </figure>

        <p>
          If your goal is to read or summarize the video, TXT is usually enough. If
          your goal is to work with captions in an editor, use SRT or VTT.
        </p>

        <h2>What If the Video Has No Transcript?</h2>
        <p>If you cannot see a transcript, one of these things is usually happening:</p>
        <ul>
          <li>The creator did not upload captions.</li>
          <li>Automatic captions are disabled or unavailable.</li>
          <li>The video language is not supported well.</li>
          <li>The video is private, restricted, or unavailable in your region.</li>
          <li>YouTube has not finished processing captions yet.</li>
        </ul>

        <figure className="g-fig">
          <div className="g-flow">
            <div className="node q">No transcript? Start here</div>
            <div className="down">↓</div>
            <div className="node">Check whether the <b>CC button</b> appears on the video player</div>
            <div className="down">↓<span>still nothing</span></div>
            <div className="node">Open the video on <b>desktop</b>: transcript options are easier to find there</div>
            <div className="down">↓<span>still nothing</span></div>
            <div className="node">Recently uploaded? <b>Wait</b>: YouTube may still be processing captions</div>
            <div className="down">↓<span>still nothing</span></div>
            <div className="node">Use a <b>tool that detects caption tracks</b>, or try another video from the same creator</div>
            <div className="down">↓<span>no captions exist</span></div>
            <div className="node">The video needs <b>audio transcription</b>, which is different from downloading existing captions</div>
          </div>
          <figcaption>Troubleshooting checklist when the transcript is missing</figcaption>
        </figure>

        <p>
          If a video truly has no captions, a transcript tool cannot always extract
          text from it. In that case, the video would need audio transcription, which
          is different from downloading existing YouTube captions.
        </p>

        <h2>How to Copy a YouTube Transcript Cleanly</h2>
        <p>
          The built-in YouTube transcript is convenient, but copying from it can be
          messy. You may get extra spacing, timestamps you do not want, or line breaks
          that make the text harder to use.
        </p>
        <p>For clean notes:</p>
        <ol>
          <li>Use the transcript panel only for quick searching.</li>
          <li>Use a transcript generator when you need reusable text.</li>
          <li>Keep timestamps if you need citations or references.</li>
          <li>Remove timestamps if you only need a readable article-style transcript.</li>
          <li>Save the source video URL with your notes.</li>
        </ol>
        <p>
          For students, researchers, writers, and journalists, timestamps matter. They
          let you return to the exact sentence in the video instead of relying on a
          copied paragraph with no source.
        </p>

        <h2>When Should You Use a Transcript?</h2>
        <p>A transcript is useful when you need to:</p>
        <ul>
          <li>Find a quote from an interview.</li>
          <li>Turn a lecture into study notes.</li>
          <li>Summarize a long podcast.</li>
          <li>Search a webinar for one topic.</li>
          <li>Repurpose a video into a blog post.</li>
          <li>Translate subtitles into another language.</li>
          <li>Create captions for editing workflows.</li>
        </ul>
        <p>
          Video is great for watching. Text is better for searching, quoting,
          summarizing, and learning quickly.
        </p>

        <h2>Quick Recommendation</h2>
        <p>
          Use YouTube's built-in transcript when you only need to look up something
          quickly. Use a free transcript generator when you need clean text,
          downloads, timestamps, or AI insights from the video.
        </p>
        <p>
          With <Link href="/">InsightsTube</Link>, you can paste a YouTube link, get
          the transcript, download TXT, SRT, or VTT files, and turn the video into a
          summary or key insights without creating an account.
        </p>

        <Cta
          title="Get a transcript in five seconds"
          sub="Free YouTube transcript generator with timestamps, downloads and AI insights."
        />

        <h2>FAQ</h2>
        <div className="faq" style={{ margin: "24px 0 0" }}>
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
