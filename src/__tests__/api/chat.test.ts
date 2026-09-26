import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { POST } from '@/app/api/chat/route';

jest.mock('@/lib/rate-limit', () => ({ rateLimit: jest.fn() }));

const mockedRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const originalEnv = process.env;
const originalFetch = global.fetch;

const validBody = {
  messages: [{ role: 'user', content: 'What is the Genesys BYOI case?' }],
};

function makeRequest(body: unknown = validBody): NextRequest {
  return new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeRawRequest(body: string): NextRequest {
  return new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('POST /api/chat', () => {
  let fetchMock: jest.MockedFunction<typeof fetch>;
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    process.env = { ...originalEnv, SARVAM_API_KEY: 'test-key' };
    mockedRateLimit.mockReset();
    mockedRateLimit.mockReturnValue(true);
    fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    consoleError.mockRestore();
  });

  it('returns 500 when the provider key is missing', async () => {
    delete process.env.SARVAM_API_KEY;

    const response = await POST(makeRequest());

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Chat is not configured' });
    expect(mockedRateLimit).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 429 when the chat rate limit rejects the request', async () => {
    mockedRateLimit.mockReturnValue(false);

    const response = await POST(makeRequest());

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: 'Too many requests. Please slow down.' });
    expect(mockedRateLimit).toHaveBeenCalledWith(expect.anything(), { prefix: 'chat', limit: 10 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 when messages are missing', async () => {
    const response = await POST(makeRequest({}));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid messages' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 when the request body is malformed', async () => {
    const response = await POST(makeRawRequest('{'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid request' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 400 when all message content is empty', async () => {
    const response = await POST(makeRequest({ messages: [{ role: 'user', content: '' }] }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid messages' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns 502 when the provider responds with an error', async () => {
    fetchMock.mockResolvedValue(new Response('provider unavailable', { status: 503 }));

    const response = await POST(makeRequest());

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'AI service error' });
  });

  it('returns 503 when the provider request fails', async () => {
    fetchMock.mockRejectedValue(new Error('provider unavailable'));

    const response = await POST(makeRequest());

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'Chat service unavailable' });
  });

  it('forwards the provider stream with an event-stream content type', async () => {
    const providerBody = 'data: {"chunk":"one"}\n\n';
    fetchMock.mockResolvedValue(new Response(providerBody, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    }));

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(response.headers.get('cache-control')).toBe('no-cache');
    expect(await response.text()).toBe(providerBody);
  });
});
