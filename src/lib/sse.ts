export interface SseState { buffer: string }

export function createSseState(): SseState {
  return { buffer: '' };
}

export function parseSseChunk(state: SseState, chunk: string): string[] {
  state.buffer += chunk;
  const frames = state.buffer.split(/\r?\n\r?\n/);
  state.buffer = frames.pop() ?? '';
  const deltas: string[] = [];
  for (const raw of frames) {
    const data = raw
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .join('\n')
      .trim();
    if (!data || data === '[DONE]') continue;
    try {
      const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta) deltas.push(delta);
    } catch {
      continue;
    }
  }
  return deltas;
}
