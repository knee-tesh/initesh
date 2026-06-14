/**
 * Tests for POST /api/admin/auth endpoint
 */

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  }),
}));

jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn().mockResolvedValue(null),
    incr: jest.fn().mockResolvedValue(1),
    expire: jest.fn().mockResolvedValue(1),
    zadd: jest.fn().mockResolvedValue(1),
    zrange: jest.fn().mockResolvedValue([]),
    zrem: jest.fn().mockResolvedValue(1),
    zcard: jest.fn().mockResolvedValue(0),
    scard: jest.fn().mockResolvedValue(0),
    sadd: jest.fn().mockResolvedValue(1),
  },
}));

describe('POST /api/admin/auth', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('returns 401 for wrong password', async () => {
    process.env.ADMIN_PASSWORD = 'correct-password';
    const { POST } = await import('@/app/api/admin/auth/route');

    const request = new Request('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 200 for correct password', async () => {
    process.env.ADMIN_PASSWORD = 'correct-password';
    const { POST } = await import('@/app/api/admin/auth/route');

    const request = new Request('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'correct-password' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
