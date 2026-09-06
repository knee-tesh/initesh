// ponytail: in-memory = per-instance; fine for a portfolio, switch to libsql if multi-instance or real abuse shows.
const hits = new Map<string, number[]>();

export function rateLimit(
  request: Request,
  opts: { prefix: string; limit: number; windowMs?: number; now?: () => number }
): boolean {
  const windowMs = opts.windowMs ?? 60000;
  const now = (opts.now ?? Date.now)();

  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const key = `${opts.prefix}:${ip}`;

  for (const [k, times] of hits) {
    if (k === key) continue;
    const alive = times.filter((t) => now - t < windowMs);
    if (alive.length === 0) hits.delete(k);
    else hits.set(k, alive);
  }

  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= opts.limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // ponytail: ceiling fallback; eviction above keeps this rare
  return true;
}
