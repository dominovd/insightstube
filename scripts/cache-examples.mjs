// Warms the static cache for the homepage example videos so clicking an example
// serves a committed JSON file instead of spending a transcript API request.
//
// Usage:
//   npm run cache:examples                 # fetch from production
//   SITE=http://localhost:3000 npm run cache:examples   # fetch from local dev
//
// Run it once, then commit the generated public/examples/*.json files.

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "examples");

// Keep in sync with exampleVideos in components/TranscriptTool.tsx
const EXAMPLE_IDS = ["km4pOGd_lHw", "-1Fhry-Mqks", "e3tXybpViHY"];

const BASE = process.env.SITE || "https://insightstube.com";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const id of EXAMPLE_IDS) {
    try {
      const res = await fetch(`${BASE}/api/transcript?url=${id}`);
      if (!res.ok) {
        console.error(`✗ ${id}: HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      delete data.debugTrace;
      if (!data.segments?.length) {
        console.error(`✗ ${id}: no segments returned`);
        continue;
      }
      await writeFile(join(OUT_DIR, `${id}.json`), JSON.stringify(data));
      console.log(`✓ ${id}: ${data.segments.length} segments (${data.lang})`);
    } catch (e) {
      console.error(`✗ ${id}: ${e.message}`);
    }
  }
}

main();
