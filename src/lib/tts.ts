let audioCtx: AudioContext | null = null;
let activeSources: AudioBufferSourceNode[] = [];
let released = 0;
let ttsUnavailable = false;
const ttsCache = new Map<string, { sampleRate: number; pcm: Uint8Array }>();

function getCtx(): AudioContext {
  audioCtx ??= new AudioContext();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

export function supportTts(): boolean {
  return !ttsUnavailable;
}

export function stopSpeaking(): void {
  released++;
  for (const s of activeSources) { try { s.stop(); } catch {} }
  activeSources = [];
}

async function playPcm(pcm: Uint8Array, sampleRate: number, onEnd?: () => void): Promise<void> {
  stopSpeaking();
  const ctx = getCtx();
  const frames = Math.floor(pcm.byteLength / 2);
  const buffer = ctx.createBuffer(1, frames, sampleRate);
  const data = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    const v = pcm[i * 2] | (pcm[i * 2 + 1] << 8);
    data[i] = v >= 32768 ? (v - 65536) / 32768 : v / 32768;
  }
  buffer.copyToChannel(data, 0);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  const gen = released;
  activeSources = [src];
  src.onended = () => {
    activeSources = [];
    if (gen === released) onEnd?.();
  };
  src.start();
}

export async function speak(text: string, opts?: { onEnd?: () => void }): Promise<void> {
  if (ttsUnavailable) throw new Error('TTS unavailable');
  const cached = ttsCache.get(text);
  if (cached) {
    await playPcm(cached.pcm, cached.sampleRate, opts?.onEnd);
    return;
  }

  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (res.status === 501) {
    ttsUnavailable = true; // latch: only 501 (missing key) hides speak buttons
    throw new Error('TTS unavailable');
  }
  if (!res.ok || !res.body) throw new Error('TTS failed');

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let sampleRate = 44100;
  let headerParsed = false;
  let pending: Uint8Array | null = null;

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    let u8 = new Uint8Array(value!);
    if (!headerParsed) {
      // first chunk carries the 44-byte RIFF header; sample rate at offset 24
      sampleRate = new DataView(u8.buffer, u8.byteOffset, 44).getUint32(24, true);
      u8 = u8.subarray(44);
      headerParsed = true;
    }
    if (pending) {
      const merged = new Uint8Array(pending.length + u8.length);
      merged.set(pending);
      merged.set(u8, pending.length);
      u8 = merged;
      pending = null;
    }
    const cut = u8.byteLength - (u8.byteLength % 2); // keep Int16 alignment across chunks
    if (cut < u8.byteLength) pending = u8.slice(cut);
    if (cut > 0) chunks.push(u8.slice(0, cut));
  }
  if (pending && pending.length >= 2) {
    chunks.push(pending.subarray(0, pending.length - (pending.length % 2)));
  }

  const total = chunks.reduce((n, c) => n + c.length, 0);
  const pcm = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { pcm.set(c, off); off += c.length; }

  if (ttsCache.size >= 20) ttsCache.delete(ttsCache.keys().next().value!);
  ttsCache.set(text, { sampleRate, pcm });

  await playPcm(pcm, sampleRate, opts?.onEnd);
}
