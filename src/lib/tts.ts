import { decodeWav, type WavAudio } from '@/lib/wav';

const CACHE_LIMIT = 20;

export type NarrationState = 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'unavailable';

export type NarrationSnapshot = {
  state: NarrationState;
  position: number;
  duration: number;
  source: string;
};

export type NarrationOptions = {
  onEnd?: () => void;
  source?: string;
};

type Listener = (snapshot: NarrationSnapshot) => void;

const audioCache = new Map<string, WavAudio>();
const listeners = new Set<Listener>();
let audioCtx: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
let buffer: AudioBuffer | null = null;
let state: NarrationState = 'idle';
let currentSource = '';
let offset = 0;
let startedAt = 0;
let generation = 0;
let requestGeneration = 0;
let pendingOnEnd: (() => void) | undefined;
let ttsUnavailable = false;
let frameId: number | null = null;

function getCtx(): AudioContext {
  audioCtx ??= new AudioContext();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function toBuffer(audio: WavAudio): AudioBuffer {
  const frames = Math.floor(audio.pcm.byteLength / 2);
  const created = getCtx().createBuffer(1, frames, audio.sampleRate);
  const samples = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    const value = audio.pcm[i * 2] | (audio.pcm[i * 2 + 1] << 8);
    samples[i] = value >= 32768 ? (value - 65536) / 32768 : value / 32768;
  }
  created.copyToChannel(samples, 0);
  return created;
}

function position(): number {
  if (state !== 'playing') return offset;
  const elapsed = getCtx().currentTime - startedAt;
  return Math.min(Math.max(offset + elapsed, 0), buffer?.duration ?? 0);
}

function snapshot(nextState = state): NarrationSnapshot {
  return {
    state: nextState,
    position: nextState === 'playing' ? position() : offset,
    duration: buffer?.duration ?? 0,
    source: currentSource,
  };
}

function publish(nextState = state): void {
  const value = snapshot(nextState);
  for (const listener of listeners) listener(value);
}

function stopFrame(): void {
  if (frameId !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frameId);
  frameId = null;
}

function scheduleFrame(gen: number): void {
  if (typeof requestAnimationFrame !== 'function') return;
  const tick = () => {
    if (gen !== generation || state !== 'playing') {
      frameId = null;
      return;
    }
    publish();
    frameId = requestAnimationFrame(tick);
  };
  frameId = requestAnimationFrame(tick);
}

function releaseSource(): void {
  if (!source) return;
  try { source.stop(); } catch {}
  source = null;
}

function startSource(from: number): void {
  if (!buffer) return;
  const ctx = getCtx();
  releaseSource();
  stopFrame();
  const gen = ++generation;
  const next = ctx.createBufferSource();
  next.buffer = buffer;
  next.connect(ctx.destination);
  source = next;
  offset = from;
  startedAt = ctx.currentTime;
  state = 'playing';
  publish();
  scheduleFrame(gen);
  next.onended = () => {
    if (gen !== generation) return;
    stopFrame();
    source = null;
    buffer = null;
    offset = 0;
    state = 'idle';
    publish();
    const done = pendingOnEnd;
    pendingOnEnd = undefined;
    done?.();
  };
  next.start(0, from);
}

export function supportTts(): boolean {
  return !ttsUnavailable;
}

export function resetTtsAvailability(): void {
  ttsUnavailable = false;
}

export function subscribeNarration(listener: Listener): () => void {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
}

export function stopSpeaking(): void {
  generation++;
  requestGeneration++;
  stopFrame();
  releaseSource();
  buffer = null;
  offset = 0;
  state = 'idle';
  pendingOnEnd = undefined;
  publish();
}

function publishLoadError(gen: number, nextState: 'error' | 'unavailable'): void {
  if (gen !== requestGeneration) return;
  state = nextState;
  publish();
}

async function loadFor(text: string, nextSource = ''): Promise<number> {
  stopSpeaking();
  currentSource = nextSource;
  state = 'loading';
  publish();
  const gen = requestGeneration;
  if (ttsUnavailable) {
    publishLoadError(gen, 'unavailable');
    throw new Error('TTS unavailable');
  }
  const cached = audioCache.get(text);
  if (cached) {
    if (gen === requestGeneration) {
      buffer = toBuffer(cached);
      state = 'idle';
      publish();
    }
    return gen;
  }

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.status === 501) {
      ttsUnavailable = true;
      publishLoadError(gen, 'unavailable');
      throw new Error('TTS unavailable');
    }
    if (!res.ok) {
      publishLoadError(gen, 'error');
      throw new Error('TTS failed');
    }

    const audio = decodeWav(new Uint8Array(await res.arrayBuffer()));
    if (audioCache.size >= CACHE_LIMIT) audioCache.delete(audioCache.keys().next().value!);
    audioCache.set(text, audio);
    if (gen === requestGeneration) {
      buffer = toBuffer(audio);
      state = 'idle';
      publish();
    }
    return gen;
  } catch (error) {
    if (gen === requestGeneration && state === 'loading') publishLoadError(gen, 'error');
    throw error;
  }
}

export async function loadNarration(text: string, source?: string): Promise<void> {
  await loadFor(text, source);
}

export function playNarration(opts?: NarrationOptions): void {
  if (opts?.source !== undefined) currentSource = opts.source;
  requestGeneration++;
  if (opts?.onEnd) pendingOnEnd = opts.onEnd;
  if (!buffer) {
    state = 'idle';
    publish();
    return;
  }
  startSource(position());
}

export function pauseNarration(): NarrationState {
  if (state !== 'playing' || !buffer) return state;
  const at = position();
  generation++;
  stopFrame();
  releaseSource();
  offset = at;
  state = 'paused';
  publish();
  return state;
}

export function resumeNarration(): NarrationState {
  if (state !== 'paused' || !buffer) return state;
  startSource(offset);
  return state;
}

export function seekNarration(deltaSeconds: number): void {
  if (!buffer) return;
  const target = Math.min(Math.max(position() + deltaSeconds, 0), buffer.duration);
  if (target >= buffer.duration) {
    stopSpeaking();
  } else if (state === 'playing') {
    startSource(target);
  } else {
    offset = target;
    publish();
  }
}

export function getNarrationState(): { state: NarrationState; position: number; duration: number } {
  return { state, position: position(), duration: buffer?.duration ?? 0 };
}

export async function speak(text: string, opts?: NarrationOptions): Promise<void> {
  const gen = await loadFor(text, opts?.source);
  if (gen !== requestGeneration) return;
  playNarration(opts);
}
