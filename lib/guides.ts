export interface GuideMeta {
  slug: string;
  tag: string;
  title: string;
  description: string;
  icon: "transcript" | "sparkles" | "list";
  gradient: "gi-1" | "gi-2" | "gi-3";
  datePublished: string;
}

export const guides: GuideMeta[] = [
  {
    slug: "how-to-get-youtube-transcript",
    tag: "Transcripts",
    title: "How to Get the Transcript of Any YouTube Video",
    description:
      "Built-in transcripts, one-click tools and what to do when captions are disabled.",
    icon: "transcript",
    gradient: "gi-1",
    datePublished: "2026-06-12",
  },
  {
    slug: "how-to-get-insights-from-youtube-video",
    tag: "Insights",
    title: "How to Get Insights from a YouTube Video",
    description:
      "Use transcripts, summaries and timestamps to pull out the ideas that matter.",
    icon: "sparkles",
    gradient: "gi-2",
    datePublished: "2026-06-12",
  },
  {
    slug: "how-to-summarize-youtube-video-with-ai-free",
    tag: "AI Summaries",
    title: "How to Summarize a YouTube Video with AI for Free",
    description:
      "Turn a long podcast, lecture or tutorial into a short readable summary with key takeaways.",
    icon: "list",
    gradient: "gi-3",
    datePublished: "2026-06-12",
  },
  {
    slug: "how-to-use-youtube-transcript-with-chatgpt-claude",
    tag: "AI Prompts",
    title: "How to Use a YouTube Transcript with ChatGPT or Claude",
    description:
      "Copy a YouTube transcript into ChatGPT, Claude or Gemini and turn it into summaries, notes, quotes and action items.",
    icon: "sparkles",
    gradient: "gi-2",
    datePublished: "2026-06-22",
  },
  {
    slug: "how-to-translate-youtube-transcript",
    tag: "Translation",
    title: "How to Translate a YouTube Transcript",
    description:
      "Learn how to translate YouTube transcripts with AI, keep timestamps, and use translated text for subtitles, study and research.",
    icon: "transcript",
    gradient: "gi-1",
    datePublished: "2026-06-22",
  },
];
