import TranscriptTool from "@/components/TranscriptTool";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import {
  IconArrowRight,
  IconBriefcase,
  IconCaptions,
  IconCheck,
  IconGlobe,
  IconGraduation,
  IconList,
  IconMicroscope,
  IconPen,
  IconSparkles,
  IconTranscript,
} from "@/components/Icons";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is InsightsTube really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can get YouTube transcripts and download subtitle files for free with no signup. AI summaries and insights may use fair-use limits to keep the tool fast and available.",
      },
    },
    {
      "@type": "Question",
      name: "What are AI video insights?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI video insights are the useful ideas extracted from a video transcript, such as the summary, key takeaways, important moments, topics and timestamped notes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Paste a YouTube link and get the transcript directly in your browser. No account or installation is required.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get insights from a YouTube video?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste the YouTube link into InsightsTube, generate the transcript, then use AI insights to turn the video into a summary, key takeaways and timestamped notes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download the transcript?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can copy the transcript as text or download it as TXT, SRT or VTT, depending on what you need.",
      },
    },
    {
      "@type": "Question",
      name: "What if a YouTube video has no captions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If a video has no available captions, InsightsTube may not be able to generate a transcript. Try another video or check whether captions are enabled on YouTube.",
      },
    },
    {
      "@type": "Question",
      name: "Do you download the video?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. InsightsTube works with the video's available caption data and does not download the YouTube video itself.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteNav />

      <header className="hero" id="top">
        <div className="float-card fc1">
          <div className="t">
            <IconTranscript size={13} /> Transcript
          </div>
          <div>
            <span className="ts">00:42</span>…the key idea here is
          </div>
          <div className="line"></div>
          <div className="line w70"></div>
          <div className="line w50"></div>
        </div>
        <div className="float-card fc2">
          <div className="t">
            <IconSparkles size={13} /> AI Summary
          </div>
          <div style={{ color: "var(--ink-2)" }}>
            This video explains 3 strategies for…{" "}
            <b style={{ color: "var(--ink)" }}>14 min → 40 sec read</b>
          </div>
        </div>
        <div className="float-card fc3">
          <div className="t">
            <IconGlobe size={13} /> Translate
          </div>
          <div style={{ color: "var(--ink-2)" }}>EN → ES, DE, FR, PT, RU +40</div>
        </div>

        <div className="wrap hero-inner">
          <div className="badge">
            <span className="dot"></span>Free YouTube transcripts · AI insights · No signup
          </div>
          <h1>
            Free YouTube Transcript
            <br />
            Generator with <span className="grad">AI Insights</span>
          </h1>
          <p className="sub">
            Paste any YouTube link to get a clean transcript with timestamps, then turn
            the video into a summary, key takeaways and useful insights. Free, fast and
            no signup needed.
          </p>

          <TranscriptTool />

          <div className="hero-meta">
            <span>
              <IconCheck size={15} />
              TXT · SRT · VTT
            </span>
            <span>
              <IconCheck size={15} />
              Clickable timestamps
            </span>
            <span>
              <IconCheck size={15} />
              AI summary
            </span>
            <span>
              <IconCheck size={15} />
              Key insights
            </span>
            <span>
              <IconCheck size={15} />
              Chat with the video
            </span>
            <span>
              <IconCheck size={15} />
              No signup
            </span>
          </div>
        </div>
      </header>

      <section id="how">
        <div className="wrap center">
          <div className="sec-label">How it works</div>
          <h2>From YouTube video to transcript and insights in three steps</h2>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Paste a YouTube link</h3>
              <p>
                Use any public YouTube video with captions: lectures, podcasts,
                tutorials, interviews, webinars and more.
              </p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Get the full transcript</h3>
              <p>
                Read clean text with clickable timestamps. Copy it instantly or
                download TXT, SRT or VTT files.
              </p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Turn it into insights</h3>
              <p>
                Use AI to extract the summary, key takeaways, important moments and
                timestamped notes from the video.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tinted">
        <div className="wrap center">
          <div className="sec-label">Free tool</div>
          <h2>Get the transcript first. Find the insights faster.</h2>
          <p className="sec-sub">
            InsightsTube turns YouTube videos into searchable text and helps you
            understand the main ideas without rewatching the whole video.
          </p>
          <div className="free-list">
            <span><IconCheck size={15} /> Full YouTube transcript with timestamps</span>
            <span><IconCheck size={15} /> Copyable clean text</span>
            <span><IconCheck size={15} /> TXT, SRT and VTT downloads</span>
            <span><IconCheck size={15} /> AI summary and key takeaways</span>
            <span><IconCheck size={15} /> Timestamped insights</span>
            <span><IconCheck size={15} /> No signup required</span>
          </div>
        </div>
      </section>

      <section id="tools" className="tinted">
        <div className="wrap center">
          <div className="sec-label">Toolkit</div>
          <h2>Tools to turn YouTube videos into text and insights</h2>
          <p className="sec-sub">
            Transcribe, summarize and extract useful ideas from YouTube videos without signup.
          </p>
          <div className="tools-grid">
            <a className="tool-card" href="#top">
              <div className="tool-ic ic-blue">
                <IconTranscript size={22} />
              </div>
              <h3>Free YouTube Transcript Generator</h3>
              <p>
                Get the full transcript of any public YouTube video with timestamps.
                Copy text or download TXT, SRT and VTT files.
              </p>
              <span className="go">
                Open tool <IconArrowRight size={13} />
              </span>
            </a>
            <a className="tool-card" href="#top">
              <div className="tool-ic ic-violet">
                <IconSparkles size={22} />
              </div>
              <h3>AI Video Insights</h3>
              <p>
                Extract the main ideas, key takeaways, important moments and
                timestamped notes from any YouTube transcript.
              </p>
              <span className="go">
                Get insights <IconArrowRight size={13} />
              </span>
            </a>
            <a className="tool-card" href="#top">
              <div className="tool-ic ic-green">
                <IconCaptions size={22} />
              </div>
              <h3>YouTube Subtitle Downloader</h3>
              <p>
                Download YouTube captions as SRT or VTT files, ready for editing,
                study notes or repurposing.
              </p>
              <span className="go">
                Open tool <IconArrowRight size={13} />
              </span>
            </a>
            <div className="tool-card">
              <span className="soon">Soon</span>
              <div className="tool-ic ic-amber">
                <IconGlobe size={22} />
              </div>
              <h3>Transcript Translator</h3>
              <p>
                Translate transcripts, subtitles and insights into 45+ languages while
                keeping timestamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="sec-label">Who it&apos;s for</div>
          <h2>Built for people who need answers from video</h2>
          <div className="aud">
            <div className="aud-card">
              <div className="aud-ic">
                <IconGraduation size={20} />
              </div>
              <h3>Students</h3>
              <p>Turn lectures into searchable notes, summaries and timestamped study insights.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconMicroscope size={20} />
              </div>
              <h3>Researchers</h3>
              <p>Extract statements, themes and useful evidence from interviews, talks and presentations.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconPen size={20} />
              </div>
              <h3>Writers &amp; journalists</h3>
              <p>Find accurate quotes, context and key points from podcasts, interviews and press events.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconBriefcase size={20} />
              </div>
              <h3>Professionals</h3>
              <p>Get the main ideas from webinars, keynotes and training videos without watching every minute.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="guides" className="tinted">
        <div className="wrap center">
          <div className="sec-label">Guides</div>
          <h2>Learn how to get more from YouTube videos</h2>
          <div className="guides">
            <a className="guide-card" href="/guides/how-to-get-youtube-transcript">
              <div className="guide-img gi-1">
                <IconTranscript size={38} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">Transcripts</div>
                <h3>How to Get the Transcript of Any YouTube Video</h3>
                <p>Built-in transcripts, one-click tools and what to do when captions are disabled.</p>
              </div>
            </a>
            <a className="guide-card" href="/guides/how-to-get-insights-from-youtube-video">
              <div className="guide-img gi-2">
                <IconSparkles size={38} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">Insights</div>
                <h3>How to Get Insights from a YouTube Video</h3>
                <p>Use transcripts, summaries and timestamps to pull out the ideas that matter.</p>
              </div>
            </a>
            <a className="guide-card" href="/guides/how-to-summarize-youtube-video-with-ai-free">
              <div className="guide-img gi-3">
                <IconList size={38} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">AI Summaries</div>
                <h3>How to Summarize a YouTube Video with AI for Free</h3>
                <p>Turn a long podcast, lecture or tutorial into a short readable summary with key takeaways.</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap center">
          <div className="sec-label">FAQ</div>
          <h2>Questions, answered</h2>
          <div className="faq">
            <details open>
              <summary>Is InsightsTube really free?</summary>
              <p>
                Yes. You can get YouTube transcripts and download subtitle files for
                free with no signup. AI summaries and insights may use fair-use limits
                to keep the tool fast and available.
              </p>
            </details>
            <details>
              <summary>What are AI video insights?</summary>
              <p>
                AI video insights are the useful ideas extracted from a video
                transcript, such as the summary, key takeaways, important moments,
                topics and timestamped notes.
              </p>
            </details>
            <details>
              <summary>Do I need to create an account?</summary>
              <p>
                No. Paste a YouTube link and get the transcript directly in your
                browser. No account or installation is required.
              </p>
            </details>
            <details>
              <summary>How do I get insights from a YouTube video?</summary>
              <p>
                Paste the YouTube link into InsightsTube, generate the transcript,
                then use AI insights to turn the video into a summary, key takeaways
                and timestamped notes.
              </p>
            </details>
            <details>
              <summary>Can I download the transcript?</summary>
              <p>
                Yes. You can copy the transcript as text or download it as TXT, SRT or
                VTT, depending on what you need.
              </p>
            </details>
            <details>
              <summary>What if a YouTube video has no captions?</summary>
              <p>
                If a video has no available captions, InsightsTube may not be able to
                generate a transcript. Try another video or check whether captions are
                enabled on YouTube.
              </p>
            </details>
            <details>
              <summary>Do you download the video?</summary>
              <p>
                No. InsightsTube works with the video&apos;s available caption data
                and does not download the YouTube video itself.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="final-cta">
            <h2>Turn YouTube videos into transcripts and insights</h2>
            <p>Paste a link, get the transcript, and find the ideas that matter. Free, fast and no signup.</p>
            <a className="btn-main" href="#top" style={{ position: "relative" }}>
              Get transcript &amp; insights →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
