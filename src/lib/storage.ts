import { kv } from '@vercel/kv';
import type { Visitor, Query, VisitorStats } from './types';

export const storage = {
  async addVisitor(visitor: Visitor): Promise<void> {
    const score = Date.now();
    await kv.zadd('visitors:all', { score, member: JSON.stringify(visitor) });
    await kv.zadd(`visitors:${visitor.page}`, { score, member: JSON.stringify(visitor) });
    await kv.incr('stats:total_visits');
    await kv.sadd('stats:unique_ips', visitor.ipHash);

    const now = new Date();
    const todayKey = `stats:daily:${now.toISOString().slice(0, 10)}`;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekKey = `stats:weekly:${weekStart.toISOString().slice(0, 10)}`;
    await kv.incr(todayKey);
    await kv.incr(weekKey);
    await kv.expire(todayKey, 86400 * 7);
    await kv.expire(weekKey, 86400 * 14);
  },

  async addQuery(query: Query): Promise<void> {
    const score = Date.now();
    await kv.zadd('queries', { score, member: JSON.stringify(query) });
  },

  async getQueries(): Promise<Query[]> {
    const items = await kv.zrange('queries', 0, -1);
    return items.map((item) => JSON.parse(item as string) as Query).reverse();
  },

  async updateQueryStatus(id: string, status: Query['status']): Promise<void> {
    const items = await kv.zrange('queries', 0, -1);
    for (const item of items) {
      const query = JSON.parse(item as string) as Query;
      if (query.id === id) {
        query.status = status;
        await kv.zrem('queries', item);
        const score = new Date(query.timestamp).getTime();
        await kv.zadd('queries', { score, member: JSON.stringify(query) });
        break;
      }
    }
  },

  async getRecentVisitors(limit: number = 20): Promise<Visitor[]> {
    const items = await kv.zrange('visitors:all', 0, limit - 1, { rev: true });
    return items.map((item) => JSON.parse(item as string) as Visitor);
  },

  async getStats(): Promise<VisitorStats> {
    const totalVisits = (await kv.get<number>('stats:total_visits')) ?? 0;
    const uniqueCount = await kv.scard('stats:unique_ips');

    const now = new Date();
    const todayKey = `stats:daily:${now.toISOString().slice(0, 10)}`;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekKey = `stats:weekly:${weekStart.toISOString().slice(0, 10)}`;

    const todayVisits = (await kv.get<number>(todayKey)) ?? 0;
    const weekVisits = (await kv.get<number>(weekKey)) ?? 0;

    const pageCounts: Record<string, number> = {};
    for (const page of ['/skills', '/services', '/about', '/contact']) {
      const count = await kv.zcard(`visitors:${page}`);
      pageCounts[page] = count;
    }

    const topPages = Object.entries(pageCounts)
      .map(([page, visits]) => ({
        page,
        visits,
        percentage: totalVisits > 0 ? Math.round((visits / totalVisits) * 100) : 0,
      }))
      .sort((a, b) => b.visits - a.visits);

    return { totalVisits, uniqueVisitors: uniqueCount, todayVisits, weekVisits, topPages };
  },

  async exportAll(): Promise<{ exportedAt: string; visitors: Visitor[]; queries: Query[]; stats: VisitorStats }> {
    const visitors = await kv.zrange('visitors:all', 0, -1);
    const queries = await kv.zrange('queries', 0, -1);
    const stats = await this.getStats();
    return {
      exportedAt: new Date().toISOString(),
      visitors: visitors.map((v) => JSON.parse(v as string)),
      queries: queries.map((q) => JSON.parse(q as string)),
      stats,
    };
  },

  async checkRateLimit(ipHash: string, windowSeconds: number = 3600, maxRequests: number = 3): Promise<boolean> {
    const key = `ratelimit:${ipHash}`;
    const count = (await kv.get<number>(key)) ?? 0;
    if (count >= maxRequests) return false;
    await kv.incr(key);
    await kv.expire(key, windowSeconds);
    return true;
  },
};
