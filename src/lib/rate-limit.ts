/**
 * Simple in-memory rate limiter using a Map.
 * Each key (e.g. IP or route) tracks request timestamps within a sliding window.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  cleanup(windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: maxRequests - entry.timestamps.length };
}

/** Pre-configured rate limiters for different route types */
export function rateLimitApi(key: string) {
  return checkRateLimit(`api:${key}`, 60, 60_000);
}

export function rateLimitWebhook(key: string) {
  return checkRateLimit(`webhook:${key}`, 10, 60_000);
}

export function rateLimitEmail(key: string) {
  return checkRateLimit(`email:${key}`, 5, 60_000);
}

export function rateLimitExport(key: string) {
  return checkRateLimit(`export:${key}`, 1, 60 * 60 * 1000);
}
