import { wavBytes } from '../helpers/wav-fixture';

const SAMPLE_RATE = 44100;
const DURATION = 2;

type FakeSource = {
  buffer: unknown;
  onended: (() => void) | null;
  start: jest.Mock;
  stop: jest.Mock;
  connect: jest.Mock;
};

class FakeAudioContext {
  static instances: FakeAudioContext[] = [];
  currentTime = 0;
  state = 'running';
  sources: FakeSource[] = [];
  destination = {};
  resume = jest.fn();
  createBuffer = jest.fn((channels: number, length: number, sampleRate: number) => ({
    numberOfChannels: channels,
    length,
    sampleRate,
    duration: length / sampleRate,
    copyToChannel: jest.fn(),
  }));
  createBufferSource = jest.fn(() => {
    const source: FakeSource = {
      buffer: null,
      onended: null,
      start: jest.fn(),
      stop: jest.fn(),
      connect: jest.fn(),
    };
    this.sources.push(source);
    return source;
  });
  constructor() {
    FakeAudioContext.instances.push(this);
  }
  advance(seconds: number) {
    this.currentTime += seconds;
  }
}

function context(): FakeAudioContext {
  return FakeAudioContext.instances[0];
}

function createdSources(): FakeSource[] {
  return FakeAudioContext.instances.flatMap((instance) => instance.sources);
}

type Tts = typeof import('@/lib/tts');
type Snapshot = { state: string; position: number; duration: number; source: string };
type EventTts = Tts & {
  subscribeNarration: (listener: (snapshot: Snapshot) => void) => () => void;
};

const originalFetch = global.fetch;
const originalRaf = globalThis.requestAnimationFrame;
const originalCancelRaf = globalThis.cancelAnimationFrame;
let tts: Tts;
let fetchMock: jest.MockedFunction<typeof fetch>;
let frameCallbacks: FrameRequestCallback[] = [];

function runAnimationFrame(): void {
  const callbacks = frameCallbacks;
  frameCallbacks = [];
  for (const callback of callbacks) callback(0);
}

function audioResponse(): Response {
  return new Response(
    wavBytes({ sampleRate: SAMPLE_RATE, pcm: SAMPLE_RATE * DURATION * 2 }),
    { status: 200 },
  );
}

function deferredResponse(): { promise: Promise<Response>; deliver: () => void } {
  let deliver!: () => void;
  const promise = new Promise<Response>((resolve) => {
    deliver = () => resolve(audioResponse());
  });
  return { promise, deliver };
}

async function setup(): Promise<void> {
  jest.resetModules();
  Object.assign(globalThis, { AudioContext: FakeAudioContext });
  frameCallbacks = [];
  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
    frameCallbacks.push(callback);
    return frameCallbacks.length;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = (() => undefined) as typeof cancelAnimationFrame;
  FakeAudioContext.instances = [];
  tts = await import('@/lib/tts');
  fetchMock = jest.fn(async () => audioResponse()) as unknown as jest.MockedFunction<typeof fetch>;
  global.fetch = fetchMock;
}

describe('tts player', () => {
  beforeEach(setup);

  afterEach(() => {
    global.fetch = originalFetch;
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancelRaf;
  });

  it('loads an utterance without starting audio', async () => {
    await tts.loadNarration('Leads the BYOI platform team.');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tts',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(createdSources()).toHaveLength(0);
    expect(tts.getNarrationState()).toEqual({ state: 'idle', position: 0, duration: DURATION });
  });

  it('speaks fetched text and reports position and duration', async () => {
    await tts.speak('Leads the BYOI platform team.');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/tts',
      expect.objectContaining({
        body: JSON.stringify({ text: 'Leads the BYOI platform team.' }),
      }),
    );
    expect(tts.getNarrationState()).toEqual({ state: 'playing', position: 0, duration: DURATION });

    context().advance(0.5);

    expect(tts.getNarrationState().position).toBeCloseTo(0.5, 5);
  });

  it('stops the active source and returns to idle', async () => {
    await tts.speak('First utterance.');
    const source = context().sources[0];

    tts.stopSpeaking();

    expect(source.stop).toHaveBeenCalled();
    expect(tts.getNarrationState()).toEqual({ state: 'idle', position: 0, duration: 0 });
  });

  it('holds position while paused and continues from it on resume', async () => {
    await tts.speak('Pause me.');
    const ctx = context();
    ctx.advance(0.5);

    tts.pauseNarration();
    ctx.advance(0.5);

    expect(tts.getNarrationState()).toEqual({
      state: 'paused',
      position: 0.5,
      duration: DURATION,
    });
    expect(ctx.sources).toHaveLength(1);

    tts.resumeNarration();
    ctx.advance(0.25);

    expect(tts.getNarrationState()).toEqual({ state: 'playing', position: 0.75, duration: DURATION });
    expect(ctx.sources[1].start).toHaveBeenCalledWith(0, 0.5);
  });

  it('seeks forward and backward inside the loaded buffer', async () => {
    await tts.speak('Seek me.');

    tts.seekNarration(0.5);
    expect(tts.getNarrationState().position).toBeCloseTo(0.5, 5);

    tts.seekNarration(-1);
    expect(tts.getNarrationState().position).toBe(0);

    tts.seekNarration(0.75);
    expect(tts.getNarrationState().position).toBeCloseTo(0.75, 5);
  });

  it('still runs the completion callback after a pause and resume', async () => {
    const onEnd = jest.fn();
    await tts.speak('Pause me.', { onEnd });

    tts.pauseNarration();
    tts.resumeNarration();
    createdSources().at(-1)!.onended?.();

    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(tts.getNarrationState().state).toBe('idle');
  });

  it('still runs the completion callback after seeking while playing', async () => {
    const onEnd = jest.fn();
    await tts.speak('Seek me.', { onEnd });

    tts.seekNarration(0.5);
    createdSources().at(-1)!.onended?.();

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('invokes the completion callback once even if the source reports ending twice', async () => {
    const onEnd = jest.fn();
    await tts.speak('End once.', { onEnd });
    const source = createdSources().at(-1)!;

    source.onended?.();
    source.onended?.();

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('does not run the completion callback after stopping', async () => {
    const onEnd = jest.fn();
    await tts.speak('Stop me.', { onEnd });
    const source = createdSources().at(-1)!;

    tts.stopSpeaking();
    source.onended?.();

    expect(onEnd).not.toHaveBeenCalled();
    expect(tts.getNarrationState().state).toBe('idle');
  });

  it('does not run a stopped utterance callback when a later play ends', async () => {
    const onEnd = jest.fn();
    await tts.speak('First utterance.', { onEnd });
    tts.stopSpeaking();

    await tts.speak('Second utterance.');
    createdSources().at(-1)!.onended?.();

    expect(onEnd).not.toHaveBeenCalled();
  });

  it('stops without running the completion callback when seeked past the end', async () => {
    const onEnd = jest.fn();
    await tts.speak('End me.', { onEnd });

    tts.seekNarration(10);
    createdSources().at(-1)!.onended?.();

    expect(onEnd).not.toHaveBeenCalled();
    expect(tts.getNarrationState()).toEqual({ state: 'idle', position: 0, duration: 0 });
  });

  it('keeps a stopped source from ending the utterance that replaced it', async () => {
    const firstEnd = jest.fn();
    const secondEnd = jest.fn();
    await tts.speak('First utterance.', { onEnd: firstEnd });
    const first = context().sources[0];
    await tts.speak('Second utterance.', { onEnd: secondEnd });

    expect(first.stop).toHaveBeenCalled();
    first.onended?.();
    expect(firstEnd).not.toHaveBeenCalled();
    expect(tts.getNarrationState().state).toBe('playing');

    context().sources[1].onended?.();

    expect(secondEnd).toHaveBeenCalled();
    expect(tts.getNarrationState().state).toBe('idle');
  });

  it('never starts audio for a load that was stopped before the response arrived', async () => {
    const slow = deferredResponse();
    fetchMock.mockImplementationOnce(() => slow.promise);

    const pending = tts.speak('Interrupted utterance.');
    tts.stopSpeaking();
    slow.deliver();
    await pending;

    expect(createdSources()).toHaveLength(0);
    expect(tts.getNarrationState()).toEqual({ state: 'idle', position: 0, duration: 0 });
  });

  it('keeps a superseded concurrent request from replacing the newer utterance', async () => {
    const slow = deferredResponse();
    fetchMock.mockImplementationOnce(() => slow.promise);

    const older = tts.speak('Older utterance.');
    const newer = tts.speak('Newer utterance.');
    await newer;
    expect(createdSources()).toHaveLength(1);

    slow.deliver();
    await older;

    expect(createdSources()).toHaveLength(1);
    expect(tts.getNarrationState()).toEqual({ state: 'playing', position: 0, duration: DURATION });
  });

  it('fetches a text once and replays the cached audio', async () => {
    await tts.speak('Cached utterance.');
    tts.stopSpeaking();
    await tts.speak('Cached utterance.');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(createdSources()).toHaveLength(2);
  });

  it('evicts the oldest cached utterance past twenty entries', async () => {
    const first = 'Utterance zero.';
    for (let i = 0; i < 21; i++) await tts.speak(`Utterance ${i}.`);
    expect(fetchMock).toHaveBeenCalledTimes(21);

    await tts.speak(first);

    expect(fetchMock).toHaveBeenCalledTimes(22);
  });

  it('latches the affordance off when the provider key is missing', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'TTS not configured' }), { status: 501 }),
    );

    await expect(tts.speak('No key here.')).rejects.toThrow(/unavailable/i);
    expect(tts.supportTts()).toBe(false);

    await expect(tts.speak('Still no key.')).rejects.toThrow(/unavailable/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('retries a missing key once the availability latch is reset', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'TTS not configured' }), { status: 501 }),
    );

    await expect(tts.speak('No key here.')).rejects.toThrow(/unavailable/i);
    expect(tts.supportTts()).toBe(false);

    fetchMock.mockResolvedValue(audioResponse());
    tts.resetTtsAvailability();

    await tts.speak('Key added.');

    expect(tts.supportTts()).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(tts.getNarrationState()).toEqual({ state: 'playing', position: 0, duration: DURATION });
  });

  it('keeps a transient failure retryable and leaves playback untouched by the reset', async () => {
    fetchMock.mockResolvedValueOnce(new Response('upstream', { status: 500 }));

    await expect(tts.speak('Transient failure.')).rejects.toThrow('TTS failed');
    expect(tts.supportTts()).toBe(true);

    const onEnd = jest.fn();
    await tts.speak('Playing utterance.', { onEnd });
    tts.resetTtsAvailability();

    expect(tts.getNarrationState().state).toBe('playing');
    createdSources().at(-1)!.onended?.();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('publishes live position from the audio clock', async () => {
    const events: Snapshot[] = [];
    const eventTts = tts as EventTts;
    const unsubscribe = eventTts.subscribeNarration((snapshot) => events.push(snapshot));

    await tts.speak('Live utterance.', { source: 'page' });
    context().advance(0.5);
    runAnimationFrame();

    expect(events.some((snapshot) => snapshot.source === 'page' && snapshot.state === 'playing')).toBe(true);
    expect(events.some((snapshot) => Math.abs(snapshot.position - 0.5) < 0.001)).toBe(true);
    unsubscribe();
  });

  it('publishes source changes when speech is superseded', async () => {
    const events: Snapshot[] = [];
    const eventTts = tts as EventTts;
    const unsubscribe = eventTts.subscribeNarration((snapshot) => events.push(snapshot));

    await tts.speak('Page utterance.', { source: 'page' });
    await tts.speak('Chat utterance.', { source: 'chat:1' });

    expect(events.some((snapshot) => snapshot.source === 'page' && snapshot.state === 'playing')).toBe(true);
    expect(events.at(-1)).toEqual({ state: 'playing', position: 0, duration: DURATION, source: 'chat:1' });
    unsubscribe();
  });

  it('publishes idle state when playback is stopped', async () => {
    const events: Snapshot[] = [];
    const eventTts = tts as EventTts;
    const unsubscribe = eventTts.subscribeNarration((snapshot) => events.push(snapshot));

    await tts.speak('Stop utterance.', { source: 'page' });
    tts.stopSpeaking();

    expect(events.at(-1)).toEqual({ state: 'idle', position: 0, duration: 0, source: 'page' });
    unsubscribe();
  });

  it('does not publish paused before a buffer exists', () => {
    const events: Snapshot[] = [];
    const eventTts = tts as EventTts;
    const unsubscribe = eventTts.subscribeNarration((snapshot) => events.push(snapshot));

    expect(tts.pauseNarration()).toBe('idle');
    expect(events.some((snapshot) => snapshot.state === 'paused')).toBe(false);
    expect(tts.getNarrationState().state).toBe('idle');
    unsubscribe();
  });

  it('returns idle when resume has nothing to resume', () => {
    expect(tts.resumeNarration()).toBe('idle');
  });

  it('returns the resulting state for pause and resume', async () => {
    await tts.speak('State transitions.', { source: 'page' });

    expect(tts.pauseNarration()).toBe('paused');
    expect(tts.resumeNarration()).toBe('playing');
  });

  it('publishes idle when seeking to the end', async () => {
    const events: Snapshot[] = [];
    const eventTts = tts as EventTts;
    const unsubscribe = eventTts.subscribeNarration((snapshot) => events.push(snapshot));

    await tts.speak('End utterance.', { source: 'page' });
    tts.seekNarration(DURATION);

    expect(events.at(-1)).toEqual({ state: 'idle', position: 0, duration: 0, source: 'page' });
    unsubscribe();
  });
});
