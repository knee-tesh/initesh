/**
 * Tests for POST /api/queries endpoint
 */

import { NextRequest } from 'next/server';

jest.mock('@libsql/client', () => ({
  createClient: jest.fn().mockReturnValue({ execute: jest.fn().mockResolvedValue({ rows: [] }) }),
}));

describe('POST /api/queries', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('rejects empty name', async () => {
    const { POST } = await import('@/app/api/queries/route');

    const request = new NextRequest('http://localhost:3000/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'test@test.com', message: 'A valid message here with ten chars' }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('Name');
  });

  it('rejects invalid email', async () => {
    const { POST } = await import('@/app/api/queries/route');

    const request = new NextRequest('http://localhost:3000/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John', email: 'not-an-email', message: 'A valid message here with ten chars' }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('email');
  });

  it('rejects short message', async () => {
    const { POST } = await import('@/app/api/queries/route');

    const request = new NextRequest('http://localhost:3000/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John', email: 'test@test.com', message: 'Short' }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toContain('Message');
  });

  it('accepts valid query submission', async () => {
    const { POST } = await import('@/app/api/queries/route');

    const request = new NextRequest('http://localhost:3000/api/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message with enough characters to pass validation.',
      }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
