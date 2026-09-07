import { rateLimit } from '@/lib/rate-limit';

function req(ip: string): Request {
  return new Request('http://localhost/api/x', { headers: { 'x-forwarded-for': ip } });
}

describe('rateLimit', () => {
  let now: number;

  beforeEach(() => { now = 1_000_000; });

  it('allows up to limit then blocks within the window', () => {
    const opts = (ip: string) => ({ prefix: 'chat', limit: 3, now: () => now });
    expect(rateLimit(req('1.1.1.1'), opts('1.1.1.1'))).toBe(true);
    expect(rateLimit(req('1.1.1.1'), opts('1.1.1.1'))).toBe(true);
    expect(rateLimit(req('1.1.1.1'), opts('1.1.1.1'))).toBe(true);
    expect(rateLimit(req('1.1.1.1'), opts('1.1.1.1'))).toBe(false);
  });

  it('keeps prefixes independent (chat vs tts budgets)', () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(req('2.2.2.2'), { prefix: 'chat', limit: 3, now: () => now })).toBe(true);
    }
    expect(rateLimit(req('2.2.2.2'), { prefix: 'chat', limit: 3, now: () => now })).toBe(false); // chat bucket exhausted
    // tts prefix untouched
    expect(rateLimit(req('2.2.2.2'), { prefix: 'tts', limit: 3, now: () => now })).toBe(true);
  });

  it('treats different IPs independently', () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(req('3.3.3.3'), { prefix: 'chat', limit: 3, now: () => now })).toBe(true);
    }
    expect(rateLimit(req('3.3.3.3'), { prefix: 'chat', limit: 3, now: () => now })).toBe(false); // 3.3.3.3 exhausted
    expect(rateLimit(req('9.9.9.9'), { prefix: 'chat', limit: 3, now: () => now })).toBe(true); // different IP untouched
  });

  it('evicts expired entries so budgets recover', () => {
    const o = { prefix: 'chat', limit: 3, windowMs: 1000, now: () => now };
    rateLimit(req('4.4.4.4'), o); rateLimit(req('4.4.4.4'), o); rateLimit(req('4.4.4.4'), o);
    expect(rateLimit(req('4.4.4.4'), o)).toBe(false);
    now = now + 1500;
    expect(rateLimit(req('4.4.4.4'), o)).toBe(true);
  });

  it('falls back to x-real-ip then unknown', () => {
    const r1 = new Request('http://x', { headers: { 'x-real-ip': '5.5.5.5' } });
    const r2 = new Request('http://x');
    const o = { prefix: 'chat', limit: 1, now: () => now };
    expect(rateLimit(r1, o)).toBe(true);
    expect(rateLimit(r2, o)).toBe(true);
    expect(rateLimit(r2, o)).toBe(false); // shared 'unknown' bucket
  });
});
