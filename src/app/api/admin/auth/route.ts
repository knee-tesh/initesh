import { NextRequest, NextResponse } from 'next/server';
import { createSession, isAdminPasswordValid } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!isAdminPasswordValid(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ success: true });
}
