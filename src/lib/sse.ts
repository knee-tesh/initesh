export interface SseState { buffer: string }

export function createSseState(): SseState {
  return { buffer: '' };
}

export function parseSseChunk(state: SseState, chunk: string): string[] {
  state.buffer += chunk;
  const frames = state.buffer.split('\n\n');
  state.buffer = frames.pop() ?? '';
  const deltas: string[] = [];
  for (const raw of frames) {
    const line = raw.trim();
    if (!line.startsWith('data:')) continue;
    const payload = line.slice(5).trim();
    if (!payload || payload === '[DONE]') continue;
    try {
      const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta) deltas.push(delta);
    } catch { /* ignore malformed frame */ }
  }
  return deltas;
}