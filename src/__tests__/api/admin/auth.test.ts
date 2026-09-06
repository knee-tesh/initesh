/**
 * Tests for POST /api/admin/auth endpoint
 */

import { NextRequest } from 'next/server';

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  }),
}));

jest.mock('@libsql/client', () => ({
  createClient: jest.fn().mockReturnValue({ execute: jest.fn().mockResolvedValue({ rows: [] }) }),
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

    const request = new NextRequest('http://localhost:3000/api/admin/auth', {
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

    const request = new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'correct-password' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
