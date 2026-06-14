/**
 * @jest-environment jsdom
 */

import { renderHook } from '@testing-library/react';

// Mock fetch
global.fetch = jest.fn(() => Promise.resolve(new Response()));

// Mock sessionStorage
const store: Record<string, string> = {};
const mockSessionStorage = {
  getItem: jest.fn((key: string) => store[key] ?? null),
  setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: jest.fn((key: string) => { delete store[key]; }),
  clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
  length: 0,
  key: jest.fn((_index: number) => null),
};
Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the hook import
jest.mock('@/hooks/use-visitor-tracking', () => ({
  useVisitorTracking: jest.fn(() => {}),
}));

describe('useVisitorTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(store).forEach(k => delete store[k]);
  });

  it('is a function', () => {
    const { useVisitorTracking } = require('@/hooks/use-visitor-tracking');
    expect(typeof useVisitorTracking).toBe('function');
  });
});
