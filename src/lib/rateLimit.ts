// In-memory failed-attempt limiter. Per server instance; see plan notes for the serverless caveat.

interface Bucket {
  count: number;
  resetAt: number;
}

const globalForLimit = globalThis as unknown as { __rateBuckets?: Map<string, Bucket> };
const buckets = globalForLimit.__rateBuckets ?? (globalForLimit.__rateBuckets = new Map<string, Bucket>());

export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim();
}

function live(key: string): Bucket | undefined {
  const bucket = buckets.get(key);
  if (bucket && bucket.resetAt <= Date.now()) {
    buckets.delete(key);
    return undefined;
  }
  return bucket;
}

export function isBlocked(key: string, max: number = LOGIN_MAX_FAILURES): boolean {
  return (live(key)?.count ?? 0) >= max;
}

export function recordFailure(key: string, windowMs: number = LOGIN_WINDOW_MS): void {
  const bucket = live(key);
  if (bucket) {
    bucket.count += 1;
    return;
  }
  if (buckets.size > 5000) buckets.clear(); // hard cap against memory growth
  buckets.set(key, { count: 1, resetAt: Date.now() + windowMs });
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}
