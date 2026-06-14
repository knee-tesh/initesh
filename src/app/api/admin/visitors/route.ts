import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { storage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const limit = parseInt(request.nextUrl.searchParams.get('limit') ?? '20');
  const visitors = await storage.getRecentVisitors(limit);
  return NextResponse.json(visitors);
}
