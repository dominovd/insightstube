"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconCheck,
  IconClock,
  IconCopy,
  IconDownload,
  IconLoader,
  IconPlay,
  IconSparkles,
} from "./Icons";

// Languages offered for transcript translation (English name sent to the model).
const TRANSLATE_LANGUAGES = [
  "Arabic",
  "Bengali",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Czech",
  "Danish",
  "Dutch",
  "Filipino",
  "Finnish",
  "French",
  "German",
  "Greek",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Indonesian",
  "Italian",
  "Japanese",
  "Korean",
  "Malay",
  "Norwegian",
  "Persian",
  "Polish",
  "Portuguese",
  "Romanian",
  "Russian",
  "Spanish",
  "Swedish",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Vietnamese",
];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface Segment {
  start: number;
  dur: number;
  text: string;
}

interface TranscriptData {
  videoId: string;
  title: string;
  author: string;
  lengthSeconds: number;
  lang: string;
  langName: string;
  segments: Segment[];
}

interface SummaryData {
  tldr: string;
  summary: string;
  whoShouldWatch?: string;
  takeaways: { text: string; timestamp: string }[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const exampleVideos = [
  {
    label: "Productivity",
    title: "Stop procrastinating",
    url: "https://www.youtube.com/watch?v=km4pOGd_lHw",
  },
  {
    label: "Mindset",
    title: "Over-optimizing life",
    url: "https://www.youtube.com/watch?v=-1Fhry-Mqks",
  },
  {
    label: "Habits",
    title: "Running every day",
    url: "https://www.youtube.com/watch?v=e3tXybpViHY",
  },
];

/** Extract an 11-char YouTube video id from a URL or bare id (client-side). */
function clientVideoId(input: string): string | null {
  const t = input.trim();
  if (/^[\w-]{11}$/.test(t)) return t;
  const m = t.match(/(?:v=|\/(?:shorts|embed|live)\/|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// Examples are pre-cached as static JSON (see scripts/cache-examples.mjs) so
// clicking one serves a committed file instead of spending an API request.
const EXAMPLE_IDS = new Set(
  exampleVideos.map((e) => clientVideoId(e.url)).filter((id): id is string => Boolean(id))
);

function tsToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

/** Renders text with [mm:ss] timestamps as buttons that seek the embedded player. */
function TimestampedText({ text, onSeek }: { text: string; onSeek: (sec: number) => void }) {
  const parts = text.split(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <button key={i} type="button" className="ts" onClick={() => onSeek(tsToSeconds(part))}>
            {part}
          </button>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function srtTime(sec: number): string {
  const ms = Math.round((sec % 1) * 1000);
  const s = Math.floor(sec);
  return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function vttTime(sec: number): string {
  return srtTime(sec).replace(",", ".");
}

function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function TranscriptTool({
  defaultTab = "transcript",
  ctaLabel = "Get transcript & insights →",
  showExamples = true,
}: {
  defaultTab?: "transcript" | "summary" | "takeaways" | "chat";
  ctaLabel?: string;
  showExamples?: boolean;
} = {}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TranscriptData | null>(null);
  const [tab, setTab] = useState<"transcript" | "summary" | "takeaways" | "chat">("transcript");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [showTs, setShowTs] = useState(true);
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [sumLoading, setSumLoading] = useState(false);
  const [sumError, setSumError] = useState("");

  // Translation
  const [translateLang, setTranslateLang] = useState("Russian");
  const [translated, setTranslated] = useState<Segment[] | null>(null);
  const [showTranslated, setShowTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");
  const [translateTruncated, setTranslateTruncated] = useState(false);

  // Search within the transcript
  const [query, setQuery] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const activeMatchRef = useRef<HTMLElement | null>(null);

  // Embedded YouTube player: seek to a moment without leaving the site.
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  function seekTo(seconds: number) {
    const win = playerRef.current?.contentWindow;
    if (!win) return;
    const t = Math.max(0, Math.floor(seconds));
    win.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [t, true] }), "*");
    win.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
    playerRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  const shown = showTranslated && translated ? translated : data?.segments ?? [];

  const matchCount = useMemo(() => {
    const q = query.trim();
    if (!q) return 0;
    const re = new RegExp(escapeRegExp(q), "gi");
    return shown.reduce((n, s) => n + (s.text.match(re)?.length ?? 0), 0);
  }, [query, shown]);

  useEffect(() => {
    setMatchIndex(0);
  }, [query, showTranslated]);

  useEffect(() => {
    activeMatchRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [matchIndex, query]);

  function gotoMatch(dir: 1 | -1) {
    if (matchCount === 0) return;
    setMatchIndex((i) => (i + dir + matchCount) % matchCount);
  }

  // Wrap query matches in <mark>; `counter` tracks the global match number so the
  // active one (selected via prev/next) gets the highlight + scroll ref.
  function highlight(text: string, counter: { n: number }) {
    const q = query.trim();
    if (!q) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "gi"));
    return parts.map((part, i) => {
      if (i % 2 === 0) return <span key={i}>{part}</span>;
      const idx = counter.n++;
      const active = idx === matchIndex;
      return (
        <mark
          key={i}
          className={active ? "hl active" : "hl"}
          ref={
            active
              ? (el: HTMLElement | null) => {
                  activeMatchRef.current = el;
                }
              : undefined
          }
        >
          {part}
        </mark>
      );
    });
  }

  async function getTranscript(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError("");
    setData(null);
    setSummary(null);
    setSumError("");
    setChat([]);
    setChatError("");
    setTranslated(null);
    setShowTranslated(false);
    setTranslateError("");
    setTranslateTruncated(false);
    setQuery("");
    setTab("transcript");
    try {
      // Examples are pre-cached as static JSON: serve them without an API call
      // (saves a transcript request and loads instantly). Falls back to the API
      // if the cache file isn't there yet.
      const id = clientVideoId(url);
      if (id && EXAMPLE_IDS.has(id)) {
        try {
          const cached = await fetch(`/examples/${id}.json`);
          if (cached.ok) {
            setData(await cached.json());
            setTab(defaultTab);
            return;
          }
        } catch {
          /* fall through to the live API */
        }
      }

      const res = await fetch("/api/transcript", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setData(json);
      setTab(defaultTab);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function getSummary() {
    if (!data || sumLoading || summary) return;
    setSumLoading(true);
    setSumError("");
    try {
      const text = data.segments.map((s) => `[${fmtTime(s.start)}] ${s.text}`).join("\n");
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: data.title, transcript: text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate a summary.");
      setSummary(json);
    } catch (e) {
      setSumError(e instanceof Error ? e.message : "Could not generate a summary.");
    } finally {
      setSumLoading(false);
    }
  }

  async function translate() {
    if (!data || translating) return;
    setTranslating(true);
    setTranslateError("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          language: translateLang,
          segments: data.segments.map((s) => ({ start: s.start, text: s.text })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not translate the transcript.");
      const translations: string[] = json.translations ?? [];
      setTranslated(data.segments.map((s, i) => ({ ...s, text: translations[i] ?? s.text })));
      setTranslateTruncated(Boolean(json.truncated));
      setShowTranslated(true);
    } catch (e) {
      setTranslateError(e instanceof Error ? e.message : "Could not translate the transcript.");
    } finally {
      setTranslating(false);
    }
  }

  function plainText(withTs: boolean): string {
    return shown
      .map((s) => (withTs ? `[${fmtTime(s.start)}] ${s.text}` : s.text))
      .join("\n");
  }

  async function copyTranscript() {
    await navigator.clipboard.writeText(plainText(showTs));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function exportSrt() {
    if (!data) return;
    const srt = shown
      .map((s, i) => `${i + 1}\n${srtTime(s.start)} --> ${srtTime(s.start + s.dur)}\n${s.text}\n`)
      .join("\n");
    download(`${data.videoId}.srt`, srt);
  }

  function exportVtt() {
    if (!data) return;
    const vtt =
      "WEBVTT\n\n" +
      shown
        .map((s) => `${vttTime(s.start)} --> ${vttTime(s.start + s.dur)}\n${s.text}\n`)
        .join("\n");
    download(`${data.videoId}.vtt`, vtt);
  }

  function selectTab(t: typeof tab) {
    setTab(t);
    if (t === "summary" || t === "takeaways") getSummary();
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const q = chatInput.trim();
    if (!q || !data || chatLoading) return;
    const next: ChatMessage[] = [...chat, { role: "user", content: q }];
    setChat(next);
    setChatInput("");
    setChatLoading(true);
    setChatError("");
    try {
      const text = data.segments.map((s) => `[${fmtTime(s.start)}] ${s.text}`).join("\n");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: data.title, transcript: text, messages: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not generate an answer.");
      setChat([...next, { role: "assistant", content: json.answer }]);
    } catch (e) {
      setChatError(e instanceof Error ? e.message : "Could not generate an answer.");
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <>
      <form className="url-box" onSubmit={getTranscript}>
        <span className="yt-ic">
          <IconPlay size={26} />
        </span>
        <input
          type="url"
          required
          placeholder="https://www.youtube.com/watch?v=…"
          aria-label="YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn-main" disabled={loading} type="submit">
          {loading ? (
            <>
              <IconLoader size={17} /> Fetching…
            </>
          ) : (
            <>{ctaLabel}</>
          )}
        </button>
      </form>

      {showExamples && !data && (
        <div className="example-videos" aria-label="Example YouTube videos">
          <span>Try an example:</span>
          {exampleVideos.map((example) => (
            <button
              key={example.url}
              type="button"
              onClick={() => {
                setUrl(example.url);
                setError("");
              }}
              aria-label={`Use example video: ${example.title}`}
            >
              <b>{example.label}</b>
              {example.title}
            </button>
          ))}
        </div>
      )}

      {error && <div className="err-box">{error}</div>}

      {data && (
        <div className="demo">
          <div className="demo-player">
            <iframe
              key={data.videoId}
              ref={playerRef}
              src={`https://www.youtube-nocookie.com/embed/${data.videoId}?enablejsapi=1&playsinline=1&rel=0`}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="demo-head">
            <div>
              <div className="demo-title">{data.title}</div>
              <div className="demo-sub">
                {data.author} · {fmtTime(data.lengthSeconds)} · Captions: {data.langName}
              </div>
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${tab === "transcript" ? "active" : ""}`}
              onClick={() => selectTab("transcript")}
            >
              Transcript
            </button>
            <button
              className={`tab ${tab === "summary" ? "active" : ""}`}
              onClick={() => selectTab("summary")}
            >
              AI Summary
            </button>
            <button
              className={`tab ${tab === "takeaways" ? "active" : ""}`}
              onClick={() => selectTab("takeaways")}
            >
              Key Takeaways
            </button>
            <button
              className={`tab ${tab === "chat" ? "active" : ""}`}
              onClick={() => selectTab("chat")}
            >
              Chat
            </button>
          </div>

          {tab === "transcript" && (
            <div className="panel">
              <div className="tr-toolbar">
                <div className="tr-search">
                  <input
                    type="text"
                    placeholder="Search the transcript…"
                    aria-label="Search the transcript"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        gotoMatch(e.shiftKey ? -1 : 1);
                      }
                    }}
                  />
                  {query.trim() && (
                    <span className="tr-search-nav">
                      <span className="tr-search-count">
                        {matchCount ? `${matchIndex + 1} / ${matchCount}` : "0 / 0"}
                      </span>
                      <button
                        type="button"
                        aria-label="Previous match"
                        disabled={!matchCount}
                        onClick={() => gotoMatch(-1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Next match"
                        disabled={!matchCount}
                        onClick={() => gotoMatch(1)}
                      >
                        ↓
                      </button>
                    </span>
                  )}
                </div>

                <div className="tr-translate">
                  <select
                    aria-label="Translate transcript to"
                    value={translateLang}
                    onChange={(e) => {
                      setTranslateLang(e.target.value);
                      setTranslated(null);
                      setShowTranslated(false);
                    }}
                  >
                    {TRANSLATE_LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <button className="chip-btn" onClick={translate} disabled={translating}>
                    {translating ? <IconLoader size={15} /> : <IconSparkles size={15} />}
                    {translating ? "Translating…" : "Translate"}
                  </button>
                  {translated && (
                    <button
                      className={`chip-btn ${showTranslated ? "active" : ""}`}
                      onClick={() => setShowTranslated((v) => !v)}
                    >
                      {showTranslated ? "Show original" : `Show ${translateLang}`}
                    </button>
                  )}
                </div>
              </div>

              {translateError && (
                <div className="err-box" style={{ margin: "0 0 12px" }}>{translateError}</div>
              )}
              {translateTruncated && showTranslated && (
                <div className="tr-note">
                  This transcript is long, so only the first part was translated.
                </div>
              )}

              <div className="tr-scroll">
                {(() => {
                  const counter = { n: 0 };
                  return shown.map((s, i) => (
                    <div className="tr-row" key={i}>
                      {showTs && (
                        <button
                          type="button"
                          className="tr-time"
                          onClick={() => seekTo(s.start)}
                          title="Play this moment"
                        >
                          {fmtTime(s.start)}
                        </button>
                      )}
                      <span className="tr-text">{highlight(s.text, counter)}</span>
                    </div>
                  ));
                })()}
              </div>
              <div className="panel-actions">
                <button className="chip-btn" onClick={copyTranscript}>
                  {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => download(`${data.videoId}.txt`, plainText(showTs))}
                >
                  <IconDownload size={15} /> TXT
                </button>
                <button className="chip-btn" onClick={exportSrt}>
                  <IconDownload size={15} /> SRT
                </button>
                <button className="chip-btn" onClick={exportVtt}>
                  <IconDownload size={15} /> VTT
                </button>
                <button className="chip-btn" onClick={() => setShowTs(!showTs)}>
                  <IconClock size={15} /> {showTs ? "Hide" : "Show"} timestamps
                </button>
              </div>
            </div>
          )}

          {tab === "summary" && (
            <div className="panel">
              {sumLoading && (
                <div className="panel-empty">
                  <IconLoader size={22} /> <br />
                  Reading the whole video for you…
                </div>
              )}
              {sumError && <div className="err-box">{sumError}</div>}
              {summary && (
                <div className="sum-block">
                  <h4>TL;DR</h4>
                  <p>{summary.tldr}</p>
                  <h4>Summary</h4>
                  <p>{summary.summary}</p>
                  {summary.whoShouldWatch && (
                    <>
                      <h4>Who should watch</h4>
                      <p>{summary.whoShouldWatch}</p>
                    </>
                  )}
                  <div className="panel-actions">
                    <button
                      className="chip-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${summary.tldr}\n\n${summary.summary}`
                        )
                      }
                    >
                      <IconCopy size={15} /> Copy summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "takeaways" && (
            <div className="panel">
              {sumLoading && (
                <div className="panel-empty">
                  <IconLoader size={22} /> <br />
                  Extracting the key points…
                </div>
              )}
              {sumError && <div className="err-box">{sumError}</div>}
              {summary && (
                <>
                  {summary.takeaways.map((t, i) => (
                    <div className="key-item" key={i}>
                      <span className="n">{i + 1}</span>
                      <span>
                        {t.text} {t.timestamp && <span className="ts">{t.timestamp}</span>}
                      </span>
                    </div>
                  ))}
                  <div className="panel-actions">
                    <button
                      className="chip-btn"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          summary.takeaways
                            .map((t, i) => `${i + 1}. ${t.text} (${t.timestamp})`)
                            .join("\n")
                        )
                      }
                    >
                      <IconCopy size={15} /> Copy takeaways
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {tab === "chat" && (
            <div className="panel">
              <div className="chat-list">
                {chat.length === 0 && (
                  <div className="panel-empty" style={{ padding: "20px 10px" }}>
                    Ask anything about this video: &quot;What are the main points?&quot;,
                    &quot;What does the speaker say about X?&quot;, &quot;Best quotes with
                    timestamps?&quot;
                  </div>
                )}
                {chat.map((m, i) => (
                  <div key={i} className={`msg ${m.role === "user" ? "me" : "ai"}`}>
                    {m.role === "assistant" ? (
                      <TimestampedText text={m.content} onSeek={seekTo} />
                    ) : (
                      m.content
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="msg ai">
                    <IconLoader size={15} /> Reading the transcript…
                  </div>
                )}
              </div>
              {chatError && <div className="err-box" style={{ margin: "10px 0" }}>{chatError}</div>}
              <form className="chat-input" onSubmit={sendChat}>
                <input
                  type="text"
                  placeholder="Ask about this video…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  maxLength={500}
                />
                <button className="btn-main" type="submit" disabled={chatLoading || !chatInput.trim()}>
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
