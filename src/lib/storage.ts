import { createClient } from '@libsql/client';
import type { Visitor, Query, VisitorStats, AnalyticsData } from './types';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const storage = {
  async addVisitor(visitor: Visitor): Promise<void> {
    await turso.execute({
      sql: `INSERT INTO visitors (id, timestamp, page, ip_hash, country, city, user_agent, referrer, session_id, visit_duration, scroll_depth, exit_page)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [visitor.id, visitor.timestamp, visitor.page, visitor.ipHash,
             visitor.country ?? null, visitor.city ?? null,
             visitor.userAgent ?? null, visitor.referrer ?? null,
             visitor.sessionId ?? null, visitor.visitDuration ?? null,
             visitor.scrollDepth ?? null, visitor.exitPage ? 1 : 0],
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
      sessionId: (row.session_id as string) ?? undefined,
      visitDuration: (row.visit_duration as number) ?? undefined,
      scrollDepth: (row.scroll_depth as number) ?? undefined,
      exitPage: (row.exit_page as number) === 1,
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

  async getAnalytics(): Promise<AnalyticsData> {
    const totalResult = await turso.execute('SELECT COUNT(*) as count FROM visitors');
    const totalVisits = totalResult.rows[0]?.count as number || 0;

    const sessionsResult = await turso.execute('SELECT COUNT(DISTINCT session_id) as count FROM visitors WHERE session_id IS NOT NULL');
    const uniqueSessions = sessionsResult.rows[0]?.count as number || 0;

    const durationResult = await turso.execute('SELECT AVG(visit_duration) as avg_duration FROM visitors WHERE visit_duration IS NOT NULL');
    const avgDuration = durationResult.rows[0]?.avg_duration as number || 0;

    const scrollResult = await turso.execute('SELECT AVG(scroll_depth) as avg_depth FROM visitors WHERE scroll_depth IS NOT NULL');
    const avgScrollDepth = scrollResult.rows[0]?.avg_depth as number || 0;

    const referrersResult = await turso.execute(`
      SELECT referrer, COUNT(*) as count
      FROM visitors
      WHERE referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `);

    const trafficResult = await turso.execute(`
      SELECT DATE(timestamp) as date, COUNT(*) as count
      FROM visitors
      WHERE timestamp >= datetime('now', '-30 days')
      GROUP BY DATE(timestamp)
      ORDER BY date
    `);

    const deviceResult = await turso.execute(`
      SELECT
        CASE
          WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' THEN 'Mobile'
          WHEN user_agent LIKE '%Tablet%' OR user_agent LIKE '%iPad%' THEN 'Tablet'
          ELSE 'Desktop'
        END as device_type,
        COUNT(*) as count
      FROM visitors
      GROUP BY device_type
    `);

    return {
      totalVisits,
      uniqueSessions,
      avgDuration: Math.round(avgDuration),
      avgScrollDepth: Math.round(avgScrollDepth),
      topReferrers: referrersResult.rows.map(r => ({
        referrer: r.referrer as string,
        count: r.count as number,
      })),
      trafficOverTime: trafficResult.rows.map(r => ({
        date: r.date as string,
        count: r.count as number,
      })),
      deviceBreakdown: deviceResult.rows.map(r => ({
        type: r.device_type as string,
        count: r.count as number,
      })),
    };
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
