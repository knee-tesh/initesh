/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react';
import { useAnalytics } from '@/hooks/use-analytics';

// Mock fetch
global.fetch = jest.fn(() => Promise.resolve({ ok: true } as Response));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/test-page'),
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window properties
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 800,
      writable: true,
    });
    Object.defineProperty(document, 'referrer', {
      value: 'https://example.com',
      writable: true,
    });
  });

  it('should not throw when document height equals viewport height (division by zero)', () => {
    // Simulate page that fits within viewport
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 800,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });

    // This should not throw or produce NaN
    expect(() => {
      renderHook(() => useAnalytics());
    }).not.toThrow();
  });

  it('should capture referrer at mount time, not at cleanup', () => {
    const referrerValue = 'https://referrer-at-mount.test';
    Object.defineProperty(document, 'referrer', {
      value: referrerValue,
      writable: true,
    });

    const { unmount } = renderHook(() => useAnalytics());

    // Simulate scroll to trigger maxScrollDepth update
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    window.dispatchEvent(new Event('scroll'));

    // Unmount to trigger cleanup and fetch
    unmount();

    // Expect fetch to have been called with referrer captured at mount
    expect(global.fetch).toHaveBeenCalledWith('/api/track', expect.objectContaining({
      body: expect.stringContaining(referrerValue),
    }));
  });

  it('should call handleScroll on mount to capture initial scroll position', () => {
    // Set initial scroll position
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 1600,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });

    const { unmount } = renderHook(() => useAnalytics());

    // Unmount to see the scrollDepth sent in fetch
    unmount();

    // The scroll depth should be calculated from initial scroll position
    // scrollTop=50, docHeight=800, scrollPercent = round(50/800*100)=6
    expect(global.fetch).toHaveBeenCalledWith('/api/track', expect.objectContaining({
      body: expect.stringContaining('"scrollDepth":6'),
    }));
  });
});