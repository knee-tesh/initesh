import { createHash } from 'crypto';

const SALT = process.env.IP_HASH_SALT ?? 'default-salt-change-me';

export function hashIP(ip: string): string {
  return createHash('sha256').update(`${SALT}:${ip}`).digest('hex');
}
