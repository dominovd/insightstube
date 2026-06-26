import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TRANSCRIPT_CHARS = 60_000;

// Per-template guidance. Each tells the model which sections to produce.
const TEMPLATES: Record<string, { name: string; instructions: string }> = {
  actions: {
    name: "actionable brief",
    instructions:
      'Sections, in order: "Key takeaways" (type "list", 4-7 items), "Action items" (type "ordered", concrete next steps the viewer can act on), and if relevant "Risks & caveats" (type "list"). Phrase action items as imperatives.',
  },
  language: {
    name: "language-learning study sheet",
    instructions:
      'Sections, in order: "Summary" (type "text", 2-4 sentences in English about what the lesson covers), "Key vocabulary & phrases" (type "pairs", 8-15 items where "term" is the word/phrase in the language being taught and "def" is its English meaning), and "Grammar & usage notes" (type "list") if the video covers any.',
  },
  study: {
    name: "study pack",
    instructions:
      'Sections, in order: "Notes" (type "list", the key points as concise study notes), "Flashcards" (type "cards", 6-12 items with a question/term as "front" and the answer as "back"), and "Quiz" (type "quiz", 4-6 multiple-choice questions, each with 3-4 "options" and a 0-based "answer" index).',
  },
  recipe: {
    name: "recipe card",
    instructions:
      'Sections, in order: "Details" (type "pairs", only facts stated in the video such as Servings, Prep time, Cook time — omit the section if none are mentioned), "Ingredients" (type "list", with quantities when stated), "Steps" (type "ordered"), and "Tips" (type "list") if the video gives any. If the video is not actually a recipe, return a single "Note" text section saying so.',
  },
  workout: {
    name: "workout program",
    instructions:
      'Sections, in order: "Overview" (type "text", who it is for and the focus), "Warm-up" (type "list") if shown, "Workout" (type "table" with columns ["Exercise","Sets","Reps","Notes"] and one row per movement), and "Cool-down" (type "list") if shown. Use only exercises and numbers actually shown in the video; leave a cell empty if a value is not stated.',
  },
};

export async function POST(req: NextRequest) {
  const limit = rateLimit(`tpl:${clientIp(req)}`, { perMinute: 2, perDay: 3 });
  if (!limit.ok) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Templates are not configured yet." }, { status: 503 });
  }

  let body: { title?: string; transcript?: string; template?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const tpl = TEMPLATES[body.template ?? ""];
  if (!tpl) {
    return NextResponse.json({ error: "Unknown template." }, { status: 400 });
  }

  const transcript = (body.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS);
  if (transcript.length < 100) {
    return NextResponse.json({ error: "Transcript is too short." }, { status: 400 });
  }

  const prompt = `You turn a YouTube video transcript into a ${tpl.name}. Transcript lines are prefixed with [mm:ss] timestamps.

Video title: ${body.title ?? "Unknown"}

Transcript:
${transcript}

Respond with ONLY valid JSON (no markdown fences):
{
  "title": "short title for the output",
  "sections": [ Section, ... ]
}

A Section is one of:
{ "heading": string, "type": "text", "text": string }
{ "heading": string, "type": "list", "items": string[] }
{ "heading": string, "type": "ordered", "items": string[] }
{ "heading": string, "type": "pairs", "items": [ { "term": string, "def": string } ] }
{ "heading": string, "type": "table", "columns": string[], "rows": string[][] }
{ "heading": string, "type": "cards", "items": [ { "front": string, "back": string } ] }
{ "heading": string, "type": "quiz", "items": [ { "q": string, "options": string[], "answer": number } ] }

${tpl.instructions}

Rules: base everything ONLY on what the transcript actually contains; never invent facts, numbers, or steps. Keep it concise and useful. Output nothing but the JSON object.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "AI service is busy. Try again in a minute." }, { status: 502 });
    }

    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not generate this template." }, { status: 502 });
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      title: typeof parsed.title === "string" ? parsed.title : "",
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    });
  } catch {
    return NextResponse.json({ error: "Could not generate this template." }, { status: 502 });
  }
}
