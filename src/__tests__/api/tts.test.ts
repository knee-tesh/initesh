import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { POST } from '@/app/api/tts/route';

jest.mock('@/lib/rate-limit', () => ({ rateLimit: jest.fn() }));

const mockedRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>;
const originalEnv = process.env;
const originalWebSocket = globalThis.WebSocket;

const AUDIO_ONE = Uint8Array.from([1, 2, 3, 4]);
const AUDIO_TWO = Uint8Array.from([5, 6]);

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];
  static failOnConstruct = false;
  static waiting: ((socket: FakeWebSocket) => void)[] = [];

  static opened(): Promise<FakeWebSocket> {
    const latest = FakeWebSocket.instances.at(-1);
    if (latest) return Promise.resolve(latest);
    return new Promise((resolve) => FakeWebSocket.waiting.push(resolve));
  }

  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  sent: string[] = [];
  closed = false;
  closeCalls = 0;

  constructor(readonly url: string) {
    if (FakeWebSocket.failOnConstruct) throw new Error('socket refused');
    FakeWebSocket.instances.push(this);
    for (const resolve of FakeWebSocket.waiting.splice(0)) resolve(this);
  }

  send(data: string) {
    this.sent.push(data);
  }

  close() {
    this.closeCalls++;
    this.closed = true;
  }

  open() {
    this.onopen?.();
  }

  emit(payload: unknown) {
    this.onmessage?.({ data: JSON.stringify(payload) });
  }

  fail() {
    this.onerror?.();
  }

  shutdown() {
    this.onclose?.();
  }
}

const base64 = (bytes: Uint8Array) => Buffer.from(bytes).toString('base64');

function makeRequest(body: unknown = { text: 'Hello there.' }): NextRequest {
  return new NextRequest('http://localhost:3000/api/tts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeRawRequest(body: string): NextRequest {
  return new NextRequest('http://localhost:3000/api/tts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('POST /api/tts', () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    process.env = { ...originalEnv, MURF_API_KEY: 'test-key', MURF_VOICE_ID: 'test-voice' };
    mockedRateLimit.mockReset();
    mockedRateLimit.mockReturnValue(true);
    FakeWebSocket.instances = [];
    FakeWebSocket.failOnConstruct = false;
    FakeWebSocket.waiting = [];
    Object.assign(globalThis, { WebSocket: FakeWebSocket });
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env = originalEnv;
    Object.assign(globalThis, { WebSocket: originalWebSocket });
    consoleError.mockRestore();
  });

  it('reports the service as unconfigured before spending a rate-limit slot', async () => {
    delete process.env.MURF_API_KEY;

    const response = await POST(makeRequest());

    expect(response.status).toBe(501);
    expect(await response.json()).toEqual({ error: 'TTS not configured' });
    expect(mockedRateLimit).not.toHaveBeenCalled();
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('rejects a body that is not valid JSON', async () => {
    const response = await POST(makeRawRequest('{'));

    expect(response.status).toBe(400);
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it.each([
    ['carries no text field', {}],
    ['carries a non-string text field', { text: 42 }],
    ['carries whitespace-only text', { text: '   ' }],
    ['carries more than 500 characters', { text: 'a'.repeat(501) }],
  ])('rejects a request that %s', async (_label, body) => {
    const response = await POST(makeRequest(body));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Text is required (max 500 chars)' });
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('rejects a request over the tts rate limit', async () => {
    mockedRateLimit.mockReturnValue(false);

    const response = await POST(makeRequest());

    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: 'Too many requests. Please slow down.' });
    expect(mockedRateLimit).toHaveBeenCalledWith(expect.anything(), { prefix: 'tts', limit: 15 });
    expect(FakeWebSocket.instances).toHaveLength(0);
  });

  it('returns 502 when the provider socket cannot be opened', async () => {
    FakeWebSocket.failOnConstruct = true;

    const response = await POST(makeRequest());

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'AI service error' });
  });

  it('returns 502 when the provider closes before sending audio', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    const socket = await FakeWebSocket.opened();
    socket.open();
    socket.shutdown();

    const response = await pending;

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'AI service error' });
    expect(jest.getTimerCount()).toBe(0);
  });

  it('returns 502 when the provider reports an error before any audio', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    const socket = await FakeWebSocket.opened();
    socket.open();
    socket.emit({ error: 'voice not found' });

    const response = await pending;

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'AI service error' });
    expect(jest.getTimerCount()).toBe(0);
  });

  it('ends the stream cleanly when the provider errors after audio started', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    const socket = await FakeWebSocket.opened();
    socket.open();
    socket.emit({ audio: base64(AUDIO_ONE) });
    socket.emit({ audio: base64(AUDIO_TWO) });
    socket.emit({ error: 'stream aborted' });

    const response = await pending;
    const audio = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(Array.from(audio)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('keeps one response and one teardown when terminal events repeat', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    const socket = await FakeWebSocket.opened();
    socket.open();
    socket.shutdown();
    socket.fail();
    socket.emit({ final: true });
    socket.emit({ error: 'late error' });
    socket.emit({ audio: base64(AUDIO_ONE) });

    const response = await pending;

    expect(response.status).toBe(502);
    expect(socket.closeCalls).toBe(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('returns 502 instead of hanging when the provider never sends audio', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    (await FakeWebSocket.opened()).open();

    await jest.advanceTimersByTimeAsync(60000);

    const response = await pending;
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: 'AI service error' });
  });

  it('asks the provider for the requested voice and text once the socket opens', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    const socket = await FakeWebSocket.opened();

    socket.open();

    expect(socket.sent).toEqual([
      JSON.stringify({
        voice_config: { voiceId: 'test-voice' },
        text: 'Hello there.',
        inference_params: { modelVersion: 'FALCON' },
      }),
      JSON.stringify({ end: true }),
    ]);

    socket.emit({ audio: base64(AUDIO_ONE) });
    socket.emit({ final: true });
    await pending;
  });

  it('streams provider audio as octet-stream and closes when the provider finalizes', async () => {
    jest.useFakeTimers();
    const pending = POST(makeRequest());
    const socket = await FakeWebSocket.opened();
    socket.open();
    socket.emit({ audio: base64(AUDIO_ONE) });
    socket.emit({ audio: base64(AUDIO_TWO) });
    socket.emit({ final: true });

    const response = await pending;
    const audio = new Uint8Array(await response.arrayBuffer());

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/octet-stream');
    expect(Array.from(audio)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(socket.closed).toBe(true);
    expect(jest.getTimerCount()).toBe(0);
  });
});
