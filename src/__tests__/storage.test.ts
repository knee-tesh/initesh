jest.mock('@libsql/client', () => ({
  createClient: jest.fn().mockReturnValue({ execute: jest.fn().mockResolvedValue({ rows: [] }) }),
}));

import type { Visitor, Query } from '@/lib/types';

describe('Storage Interface', () => {
  const mockVisitor: Visitor = {
    id: 'v1',
    timestamp: new Date().toISOString(),
    page: '/skills',
    ipHash: 'abc123',
    country: 'US',
    city: 'NYC',
    userAgent: 'test-agent',
    referrer: undefined,
  };

  const mockQuery: Query = {
    id: 'q1',
    timestamp: new Date().toISOString(),
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message for the portfolio',
    status: 'new',
  };

  it('Visitor type accepts optional fields as undefined', () => {
    const minimal: Visitor = {
      id: 'v2',
      timestamp: new Date().toISOString(),
      page: '/about',
      ipHash: 'def456',
    };
    expect(minimal.country).toBeUndefined();
    expect(minimal.city).toBeUndefined();
    expect(minimal.userAgent).toBeUndefined();
    expect(minimal.referrer).toBeUndefined();
  });

  it('Query type accepts all valid statuses', () => {
    const statuses: Query['status'][] = ['new', 'read', 'replied'];
    for (const status of statuses) {
      const q: Query = { ...mockQuery, id: `q-${status}`, status };
      expect(q.status).toBe(status);
    }
  });
});
