import { createSseState, parseSseChunk } from '@/lib/sse';

describe('parseSseChunk', () => {
  it('extracts delta.content from data: JSON frames', () => {
    const state = createSseState();
    const out = parseSseChunk(state, 'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n');
    expect(out).toEqual(['Hel']);
  });

  it('skips [DONE], non-data lines, and null deltas', () => {
    const state = createSseState();
    const out = parseSseChunk(state, 'data: [DONE]\n\nevent: ping\n\ndata: {"choices":[{"delta":{"content":null}}]}\n\n');
    expect(out).toEqual([]);
  });

  it('parses frames split across chunk boundaries', () => {
    const state = createSseState();
    const first = parseSseChunk(state, 'data: {"choices":[{"delta":{"con');
    expect(first).toEqual([]);
    const second = parseSseChunk(state, 'tent":"lo"}}]}\n\ndata: {"choices":[{"delta":{"content":" world"}}]}\n\n');
    expect(second).toEqual(['lo', ' world']);
  });

  it('ignores garbage JSON frames instead of throwing', () => {
    const state = createSseState();
    const out = parseSseChunk(state, 'data: not-json\n\n');
    expect(out).toEqual([]);
  });
});
