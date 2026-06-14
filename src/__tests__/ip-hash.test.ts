import { hashIP } from '@/lib/ip-hash';

describe('hashIP', () => {
  it('returns a consistent hash for the same IP', () => {
    const h1 = hashIP('192.168.1.1');
    const h2 = hashIP('192.168.1.1');
    expect(h1).toBe(h2);
  });

  it('returns different hashes for different IPs', () => {
    const h1 = hashIP('192.168.1.1');
    const h2 = hashIP('10.0.0.1');
    expect(h1).not.toBe(h2);
  });

  it('returns a hex string of 64 characters (SHA-256)', () => {
    const hash = hashIP('8.8.8.8');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
