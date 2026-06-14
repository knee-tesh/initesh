/**
 * Tests for POST /api/track endpoint
 * Tests the handler's input validation and response behavior.
 */

describe('POST /api/track', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('returns 400 for invalid page', async () => {
    const { POST } = await import('@/app/api/track/route');

    const request = new Request('http://localhost:3000/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/invalid-page', referrer: null, userAgent: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 204 for valid tracking data', async () => {
    const { POST } = await import('@/app/api/track/route');

    const request = new Request('http://localhost:3000/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/skills', referrer: null, userAgent: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(204);
  });
});
