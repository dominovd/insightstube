// Lightweight in-memory rate limiter (per warm serverless instance).
// Good enough to stop bursts and casual abuse; swap for Upstash/Vercel KV
// when traffic grows and you need exact cross-instance counting.

interface Bucket {
  minute: { count: number; resetAt: number };
  day: { count: number; resetAt: number };
}

const store = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export interface LimitConfig {
  perMinute: number;
  perDay: number;
}

export function rateLimit(
  key: string,
  { perMinute, perDay }: LimitConfig
): { ok: boolean; reason?: string } {
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

  if (b.minute.count >= perMinute) {
    return { ok: false, reason: "Too many requests — wait a minute and try again." };
  }
  if (b.day.count >= perDay) {
    return { ok: false, reason: "Daily limit reached. Come back tomorrow!" };
  }

  b.minute.count++;
  b.day.count++;
  return { ok: true };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : "") || req.headers.get("x-real-ip") || "unknown";
}
