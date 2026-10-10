import { getClientIp } from "@/lib/ip";
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || cur.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (cur.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((cur.resetAt - now) / 1000)) };
  }
  cur.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/**
 * Route helper: returns a 429 Response when the caller's IP has used up its
 * budget for `scope`, or null when the request may proceed. Keyed by client IP
 * so it works before authentication (login, register, trial, redeem).
 *
 * Note: the buckets live in process memory. That is correct for the single
 * Railway instance this app runs on; move to Redis before scaling out.
 */
export function rateLimitRequest(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Response | null {
  const rl = rateLimit(`${scope}:${getClientIp(req)}`, limit, windowMs);
  if (rl.ok) return null;
  return Response.json(
    { error: `Too many requests — try again in ${rl.retryAfterSec}s` },
    { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
  );
}
