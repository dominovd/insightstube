# InsightsTube

Turn any YouTube video into text & insights: transcripts with timestamps, TXT/SRT/VTT export, and one-click AI summaries (Claude Haiku).

## Stack

Next.js 15 (App Router, TypeScript), no UI libraries. API routes:

- `POST /api/transcript` — `{ url }` → title, caption languages, segments (reads YouTube caption tracks; no video/audio is downloaded)
- `POST /api/summarize` — `{ title, transcript }` → TL;DR, summary, takeaways (requires `ANTHROPIC_API_KEY`)

## Local dev

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

## Deploy to Vercel via GitHub

1. Create a GitHub repo (e.g. `insightstube`):
   ```bash
   git remote add origin git@github.com:<you>/insightstube.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo. Framework is auto-detected (Next.js), no build settings needed.
3. In **Settings → Environment Variables** add:
   - `ANTHROPIC_API_KEY` — key from [console.anthropic.com](https://console.anthropic.com/)
4. Deploy. Then **Settings → Domains** → add `insightstube.com` and follow the DNS instructions (A record `76.76.21.21` or CNAME `cname.vercel-dns.com`).

Every `git push` to `main` redeploys automatically.

## Notes

- `/docs` (keyword research, content plan, mockup) is git-ignored — local planning files only.
- YouTube occasionally rate-limits datacenter IPs for caption fetches. If `/api/transcript` starts failing on Vercel, options: retry logic, a small proxy, or self-host the route region closer to users.
- AdSense: add real content pages (guides) before applying; see `docs/site-structure-content-plan.md`.
