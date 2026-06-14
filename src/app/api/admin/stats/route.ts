import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { storage } from '@/lib/storage';

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stats = await storage.getStats();
  return NextResponse.json(stats);
}
