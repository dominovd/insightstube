"use client";

import { useState } from "react";
import {
  IconCheck,
  IconClock,
  IconCopy,
  IconDownload,
  IconLoader,
  IconPlay,
  IconSparkles,
} from "./Icons";

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

function tsToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

/** Renders text with [mm:ss] timestamps as links to the video moment. */
function TimestampedText({ text, videoId }: { text: string; videoId: string }) {
  const parts = text.split(/\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a
            key={i}
            className="ts"
            href={`https://www.youtube.com/watch?v=${videoId}&t=${tsToSeconds(part)}s`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
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
}: {
  defaultTab?: "transcript" | "summary" | "takeaways" | "chat";
  ctaLabel?: string;
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
    setTab("transcript");
    try {
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

  function plainText(withTs: boolean): string {
    if (!data) return "";
    return data.segments
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
    const srt = data.segments
      .map((s, i) => `${i + 1}\n${srtTime(s.start)} --> ${srtTime(s.start + s.dur)}\n${s.text}\n`)
      .join("\n");
    download(`${data.videoId}.srt`, srt);
  }

  function exportVtt() {
    if (!data) return;
    const vtt =
      "WEBVTT\n\n" +
      data.segments
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

      {error && <div className="err-box">{error}</div>}

      {data && (
        <div className="demo">
          <div className="demo-head">
            <div className="demo-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${data.videoId}/mqdefault.jpg`}
                alt=""
                loading="lazy"
              />
            </div>
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
              <div className="tr-scroll">
                {data.segments.map((s, i) => (
                  <div className="tr-row" key={i}>
                    {showTs && (
                      <a
                        className="tr-time"
                        href={`https://www.youtube.com/watch?v=${data.videoId}&t=${Math.floor(s.start)}s`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fmtTime(s.start)}
                      </a>
                    )}
                    <span className="tr-text">{s.text}</span>
                  </div>
                ))}
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
                      <TimestampedText text={m.content} videoId={data.videoId} />
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
