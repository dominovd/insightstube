// Rate limiter with a shared store (Upstash Redis / Vercel KV REST API) so limits
// hold across serverless instances. Falls back to a per-instance in-memory counter
// when no KV store is configured (e.g. local dev), so the app keeps working.

export interface LimitConfig {
  perMinute: number;
  perDay: number;
}

export interface LimitResult {
  ok: boolean;
  reason?: string;
}

const TOO_MANY = "Too many requests. Wait a minute and try again.";
const DAILY = "Daily limit reached. Come back tomorrow!";

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

// ── shared store (Upstash REST pipeline) ────────────────────────────────────
async function rateLimitKV(
  key: string,
  { perMinute, perDay }: LimitConfig,
  kv: { url: string; token: string }
): Promise<LimitResult> {
  const minKey = `rl:${key}:m:${Math.floor(Date.now() / 60000)}`;
  const dayKey = `rl:${key}:d:${new Date().toISOString().slice(0, 10)}`;

  const res = await fetch(`${kv.url}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${kv.token}`, "content-type": "application/json" },
    cache: "no-store",
    body: JSON.stringify([
      ["INCR", minKey],
      ["EXPIRE", minKey, 120, "NX"],
      ["INCR", dayKey],
      ["EXPIRE", dayKey, 90000, "NX"],
    ]),
  });
  if (!res.ok) throw new Error(`kv ${res.status}`);
  const out = (await res.json()) as { result?: number; error?: string }[];
  const minCount = Number(out?.[0]?.result ?? 0);
  const dayCount = Number(out?.[2]?.result ?? 0);

  if (minCount > perMinute) return { ok: false, reason: TOO_MANY };
  if (dayCount > perDay) return { ok: false, reason: DAILY };
  return { ok: true };
}

// ── per-instance fallback (best effort, used when no KV store is set) ────────
interface Bucket {
  minute: { count: number; resetAt: number };
  day: { count: number; resetAt: number };
}
const store = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

function rateLimitMemory(key: string, { perMinute, perDay }: LimitConfig): LimitResult {
  const now = Date.now();
  if (store.size > MAX_KEYS) store.clear();

  let b = store.get(key);
  if (!b) {
    b = {
      minute: { count: 0, resetAt: now + 60_000 },
      day: { count: 0, resetAt: now + 86_400_000 },
    };
    store.set(key, b);
  }
  if (now > b.minute.resetAt) b.minute = { count: 0, resetAt: now + 60_000 };
  if (now > b.day.resetAt) b.day = { count: 0, resetAt: now + 86_400_000 };

  if (b.minute.count >= perMinute) return { ok: false, reason: TOO_MANY };
  if (b.day.count >= perDay) return { ok: false, reason: DAILY };

  b.minute.count++;
  b.day.count++;
  return { ok: true };
}

export async function rateLimit(key: string, config: LimitConfig): Promise<LimitResult> {
  const kv = kvConfig();
  if (!kv) return rateLimitMemory(key, config);
  try {
    return await rateLimitKV(key, config, kv);
  } catch {
    // KV unreachable: degrade to the in-memory limiter rather than hard-failing.
    return rateLimitMemory(key, config);
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : "") || req.headers.get("x-real-ip") || "unknown";
}
