import type { Visitor, Query, AdminSession, VisitorStats } from '@/lib/types';

describe('Types', () => {
  it('Visitor type has required fields', () => {
    const visitor: Visitor = {
      id: 'abc',
      timestamp: '2026-01-01T00:00:00Z',
      page: '/skills',
      ipHash: 'hash123',
      country: 'US',
      city: 'San Francisco',
      userAgent: 'Mozilla/5.0',
      referrer: 'https://google.com',
    };
    expect(visitor.id).toBe('abc');
    expect(visitor.page).toBe('/skills');
    expect(visitor.country).toBe('US');
  });

  it('Query type has status field', () => {
    const query: Query = {
      id: 'q1',
      timestamp: '2026-01-01T00:00:00Z',
      name: 'John',
      email: 'john@example.com',
      message: 'Hello there',
      status: 'new',
    };
    expect(query.status).toBe('new');
  });

  it('AdminSession has expiration', () => {
    const session: AdminSession = {
      token: 'tok123',
      expiresAt: Date.now() + 3600000,
    };
    expect(session.expiresAt).toBeGreaterThan(Date.now());
  });

  it('VisitorStats has all fields', () => {
    const stats: VisitorStats = {
      totalVisits: 100,
      uniqueVisitors: 50,
      todayVisits: 10,
      weekVisits: 30,
      topPages: [{ page: '/skills', visits: 40, percentage: 40 }],
    };
    expect(stats.topPages[0].page).toBe('/skills');
    expect(stats.topPages[0].percentage).toBe(40);
  });
});
