import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { hashIP } from '@/lib/ip-hash';
import type { Query } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Name must be 2-100 characters' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.length < 10 || message.length > 1000) {
      return NextResponse.json({ error: 'Message must be 10-1000 characters' }, { status: 400 });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? '127.0.0.1';
    const ipHash = hashIP(ip);

    const allowed = await storage.checkRateLimit(ipHash, 3600, 3);
    if (!allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
    }

    const query: Query = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      name,
      email,
      message,
      status: 'new',
    };

    await storage.addQuery(query);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
