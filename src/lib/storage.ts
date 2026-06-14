import { createClient } from '@libsql/client';
import type { Visitor, Query, VisitorStats } from './types';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const storage = {
  async addVisitor(visitor: Visitor): Promise<void> {
    await turso.execute({
      sql: `INSERT INTO visitors (id, timestamp, page, ip_hash, country, city, user_agent, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [visitor.id, visitor.timestamp, visitor.page, visitor.ipHash,
             visitor.country ?? null, visitor.city ?? null,
             visitor.userAgent ?? null, visitor.referrer ?? null],
    });
  },

  async addQuery(query: Query): Promise<void> {
    await turso.execute({
      sql: `INSERT INTO queries (id, timestamp, name, email, message, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [query.id, query.timestamp, query.name, query.email, query.message, query.status],
    });
  },

  async getQueries(): Promise<Query[]> {
    const rs = await turso.execute({
      sql: 'SELECT * FROM queries ORDER BY timestamp DESC',
      args: [],
    });
    return rs.rows.map(row => ({
      id: row.id as string,
      timestamp: row.timestamp as string,
      name: row.name as string,
      email: row.email as string,
      message: row.message as string,
      status: row.status as Query['status'],
    }));
  },

  async updateQueryStatus(id: string, status: Query['status']): Promise<void> {
    await turso.execute({
      sql: 'UPDATE queries SET status = ? WHERE id = ?',
      args: [status, id],
    });
  },

  async getRecentVisitors(limit: number = 20): Promise<Visitor[]> {
    const rs = await turso.execute({
      sql: 'SELECT * FROM visitors ORDER BY timestamp DESC LIMIT ?',
      args: [limit],
    });
    return rs.rows.map(row => ({
      id: row.id as string,
      timestamp: row.timestamp as string,
      page: row.page as string,
      ipHash: row.ip_hash as string,
      country: (row.country as string) ?? undefined,
      city: (row.city as string) ?? undefined,
      userAgent: (row.user_agent as string) ?? undefined,
      referrer: (row.referrer as string) ?? undefined,
    }));
  },

  async getStats(): Promise<VisitorStats> {
    const totalVisits = (await turso.execute({ sql: 'SELECT COUNT(*) as c FROM visitors', args: [] })).rows[0].c as number;
    const uniqueCount = (await turso.execute({ sql: 'SELECT COUNT(DISTINCT ip_hash) as c FROM visitors', args: [] })).rows[0].c as number;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const todayVisits = (await turso.execute({
      sql: 'SELECT COUNT(*) as c FROM visitors WHERE timestamp >= ?',
      args: [todayStart],
    })).rows[0].c as number;

    const weekVisits = (await turso.execute({
      sql: 'SELECT COUNT(*) as c FROM visitors WHERE timestamp >= ?',
      args: [weekStart.toISOString()],
    })).rows[0].c as number;

    const pages = ['/skills', '/services', '/about', '/contact'];
    const pageCounts: Record<string, number> = {};

    for (const page of pages) {
      const rs = await turso.execute({
        sql: 'SELECT COUNT(*) as c FROM visitors WHERE page = ?',
        args: [page],
      });
      pageCounts[page] = rs.rows[0].c as number;
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
    const visitors = await this.getRecentVisitors(100000);
    const queries = await this.getQueries();
    const stats = await this.getStats();
    return {
      exportedAt: new Date().toISOString(),
      visitors,
      queries,
      stats,
    };
  },

  async checkRateLimit(ipHash: string, windowSeconds: number = 3600, maxRequests: number = 3): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % windowSeconds);

    const row = await turso.execute({
      sql: 'SELECT count FROM rate_limits WHERE ip_hash = ? AND window_start = ?',
      args: [ipHash, windowStart],
    });

    if (row.rows.length === 0) {
      await turso.execute({
        sql: 'INSERT INTO rate_limits (ip_hash, window_start, count) VALUES (?, ?, 1)',
        args: [ipHash, windowStart],
      });
      return true;
    }

    const count = row.rows[0].count as number;
    if (count >= maxRequests) return false;

    await turso.execute({
      sql: 'UPDATE rate_limits SET count = count + 1 WHERE ip_hash = ? AND window_start = ?',
      args: [ipHash, windowStart],
    });
    return true;
  },
};
