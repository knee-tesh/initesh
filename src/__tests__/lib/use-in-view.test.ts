/* @jest-environment jsdom */
import { act, render, cleanup } from '@testing-library/react';
import React from 'react';
import { useInView } from '@/lib/use-in-view';

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

const realIO = globalThis.IntersectionObserver;

class MockIO implements IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [0];
  constructor(private cb: IntersectionObserverCallback) {}
  observe(_el: Element) {
    // async so inView stays false until the test awaits
    setTimeout(() => this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this), 0);
  }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

function Probe() {
  const { ref, inView } = useInView({ once: true });
  return React.createElement('div', { ref, 'data-inview': String(inView) });
}

describe('useInView', () => {
  beforeEach(() => { (globalThis as any).IntersectionObserver = MockIO; });
  afterEach(() => { (globalThis as any).IntersectionObserver = realIO; cleanup(); });

  it('starts false and flips true when the observer reports intersecting', async () => {
    const { container } = render(React.createElement(Probe));
    const el = container.querySelector('[data-inview]') as HTMLElement;
    expect(el.dataset.inview).toBe('false');
    await act(async () => { await tick(); });
    expect(el.dataset.inview).toBe('true');
  });
});