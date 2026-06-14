import { cookies } from 'next/headers';
import type { AdminSession } from './types';

const SESSION_COOKIE = 'admin-session';
const SESSION_MAX_AGE = 24 * 60 * 60;

export async function createSession(): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const session: AdminSession = { token, expiresAt };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return token;
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return false;

  try {
    const session: AdminSession = JSON.parse(raw);
    return session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function isAdminPasswordValid(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD;
}
