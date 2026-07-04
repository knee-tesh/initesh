import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { hashIP } from '@/lib/ip-hash';
import type { Visitor } from '@/lib/types';

const ALLOWED_PAGES = ['/skills', '/services', '/about', '/contact'];
const FALLBACK_IP = '127.0.0.1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, userAgent, sessionId, visitDuration, scrollDepth } = body;

    if (!page || !ALLOWED_PAGES.includes(page)) {
      return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? FALLBACK_IP;
    const ipHash = hashIP(ip);

    const country = request.headers.get('x-vercel-ip-country') ?? undefined;
    const city = request.headers.get('x-vercel-ip-city')
      ? decodeURIComponent(request.headers.get('x-vercel-ip-city')!)
      : undefined;

    const visitor: Visitor = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      page,
      ipHash,
      country,
      city,
      userAgent: userAgent ?? undefined,
      referrer: referrer ?? undefined,
      sessionId: sessionId ?? undefined,
      visitDuration: visitDuration ?? undefined,
      scrollDepth: scrollDepth ?? undefined,
    };

    await storage.addVisitor(visitor);

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
