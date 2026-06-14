import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { storage } from '@/lib/storage';

export async function POST() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await storage.exportAll();
  return NextResponse.json(data);
}
