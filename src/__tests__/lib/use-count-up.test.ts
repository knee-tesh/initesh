/* @jest-environment jsdom */
import { act, renderHook } from '@testing-library/react';
import { useCountUp } from '@/lib/use-count-up';

describe('useCountUp', () => {
  const realRaf = globalThis.requestAnimationFrame;
  const realCaf = globalThis.cancelAnimationFrame;
  const realMatchMedia = (globalThis as any).matchMedia;

  beforeAll(() => {
    // Deterministic rAF stub: invoke the tick immediately with a timestamp far
    // past the duration so the count-up completes in one synchronous tick
    // (jest-jsdom's real rAF never fires, and act defers timer callbacks).
    (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(performance.now() + 500);
      return 1;
    };
    (globalThis as any).cancelAnimationFrame = () => {};
    (globalThis as any).matchMedia = (q: string) => ({
      matches: false,
      media: q,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() { return false; },
    });
  });

  afterAll(() => {
    (globalThis as any).requestAnimationFrame = realRaf;
    (globalThis as any).cancelAnimationFrame = realCaf;
    (globalThis as any).matchMedia = realMatchMedia;
  });

  it('returns start when inactive', () => {
    const { result } = renderHook(() => useCountUp(50, { active: false, duration: 40 }));
    expect(result.current).toBe(0);
  });

  it('reaches the target once active', async () => {
    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) => useCountUp(50, { active, duration: 40 }),
      { initialProps: { active: false } }
    );
    expect(result.current).toBe(0);
    await act(async () => {
      rerender({ active: true });
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(result.current).toBe(50);
  });
});