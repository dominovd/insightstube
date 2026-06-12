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
  IconTv,
} from "@/components/Icons";

export default function Home() {
  return (
    <>
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
            <span className="dot"></span>Free · No signup · Works in 5 seconds
          </div>
          <h1>
            Turn any YouTube video
            <br />
            into <span className="grad">text &amp; insights</span>
          </h1>
          <p className="sub">
            Paste a link — get the full transcript, an AI summary, key takeaways and
            subtitle files. Stop scrubbing through videos to find one quote.
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
              One-click AI summary
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
          <h2>From video to insight in three steps</h2>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <h3>Paste a YouTube link</h3>
              <p>
                Any public video with captions — lectures, podcasts, tutorials,
                interviews. No account needed.
              </p>
            </div>
            <div className="step">
              <div className="num">2</div>
              <h3>Get the full transcript</h3>
              <p>
                Clean text with clickable timestamps. Copy it, or download as TXT, SRT
                or VTT in one click.
              </p>
            </div>
            <div className="step">
              <div className="num">3</div>
              <h3>Let AI do the reading</h3>
              <p>
                One click turns a 40-minute video into a summary and key takeaways
                with timestamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="tinted">
        <div className="wrap center">
          <div className="sec-label">Toolkit</div>
          <h2>Everything you need to work with video as text</h2>
          <p className="sec-sub">Single-purpose tools. No signup, no credits, no watermarks.</p>
          <div className="tools-grid">
            <a className="tool-card" href="#top">
              <div className="tool-ic ic-blue">
                <IconTranscript size={22} />
              </div>
              <h3>Transcript Generator</h3>
              <p>Full transcript of any video with timestamps. TXT, SRT &amp; VTT export.</p>
              <span className="go">
                Open tool <IconArrowRight size={13} />
              </span>
            </a>
            <a className="tool-card" href="#top">
              <div className="tool-ic ic-violet">
                <IconSparkles size={22} />
              </div>
              <h3>AI Video Summarizer</h3>
              <p>TL;DR, full summary and key takeaways from any video in one click.</p>
              <span className="go">
                Open tool <IconArrowRight size={13} />
              </span>
            </a>
            <a className="tool-card" href="#top">
              <div className="tool-ic ic-green">
                <IconCaptions size={22} />
              </div>
              <h3>Subtitle Downloader</h3>
              <p>Download the caption file of any video as SRT or VTT, ready for editing.</p>
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
              <p>Translate transcripts and subtitles into 45+ languages, keeping timestamps.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap center">
          <div className="sec-label">Who it&apos;s for</div>
          <h2>Built for people who learn from video</h2>
          <div className="aud">
            <div className="aud-card">
              <div className="aud-ic">
                <IconGraduation size={20} />
              </div>
              <h3>Students</h3>
              <p>Turn lectures into searchable notes and quote sources with exact timestamps.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconMicroscope size={20} />
              </div>
              <h3>Researchers</h3>
              <p>Extract and cite statements from interviews and talks without re-watching.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconPen size={20} />
              </div>
              <h3>Writers &amp; journalists</h3>
              <p>Pull accurate quotes from podcasts and press events in seconds.</p>
            </div>
            <div className="aud-card">
              <div className="aud-ic">
                <IconBriefcase size={20} />
              </div>
              <h3>Professionals</h3>
              <p>Get the gist of hour-long webinars and keynotes on a coffee break.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="guides" className="tinted">
        <div className="wrap center">
          <div className="sec-label">Guides</div>
          <h2>Learn the tricks YouTube doesn&apos;t show you</h2>
          <div className="guides">
            <a className="guide-card" href="#">
              <div className="guide-img gi-1">
                <IconTranscript size={38} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">Transcripts</div>
                <h3>How to Get the Transcript of Any YouTube Video — 3 Ways</h3>
                <p>Built-in transcripts, our one-click tool, and what to do when captions are disabled.</p>
              </div>
            </a>
            <a className="guide-card" href="#">
              <div className="guide-img gi-2">
                <IconTv size={38} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">YouTube TV</div>
                <h3>YouTube TV Not Working? Every Fix That Actually Helps</h3>
                <p>Buffering, login loops and error codes — a complete troubleshooting checklist.</p>
              </div>
            </a>
            <a className="guide-card" href="#">
              <div className="guide-img gi-3">
                <IconList size={38} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">AI Summaries</div>
                <h3>How to Summarize a YouTube Video with AI (Free)</h3>
                <p>Turn a 2-hour podcast into a 2-minute read — and when not to trust the summary.</p>
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
              <summary>Is it really free?</summary>
              <p>
                Yes. Transcripts and subtitle downloads are free with no signup. AI
                summaries have a generous fair-use limit to keep the lights on.
              </p>
            </details>
            <details>
              <summary>Do you download the video?</summary>
              <p>
                No. We only read the caption track that YouTube already publishes for
                the video — no video or audio files are ever downloaded or stored.
              </p>
            </details>
            <details>
              <summary>What if a video has no captions?</summary>
              <p>
                If the creator disabled captions and YouTube has no auto-captions,
                there is no transcript to fetch. Our guide covers AI transcription
                alternatives for that case.
              </p>
            </details>
            <details>
              <summary>Which formats can I export?</summary>
              <p>
                Plain text with or without timestamps, plus SRT and VTT subtitle files
                ready for video editors and players.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="final-cta">
            <h2>Stop watching. Start reading.</h2>
            <p>Paste a link and get the transcript in five seconds — free, no signup.</p>
            <a className="btn-main" href="#top" style={{ position: "relative" }}>
              Get a transcript now →
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
