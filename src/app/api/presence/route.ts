import { NextRequest, NextResponse } from 'next/server';

// In-memory store for active visitors (resets on server restart)
const activeVisitors = new Map<string, { page: string; lastSeen: number }>();

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const TIMEOUT = 60000; // 1 minute

// Clean up stale visitors
function cleanup() {
  const now = Date.now();
  const staleIds: string[] = [];
  activeVisitors.forEach((data, id) => {
    if (now - data.lastSeen > TIMEOUT) {
      staleIds.push(id);
    }
  });
  staleIds.forEach(id => activeVisitors.delete(id));
}

export async function GET() {
  cleanup();
  const visitors: { id: string; page: string; lastSeen: number }[] = [];
  activeVisitors.forEach((data, id) => {
    visitors.push({
      id,
      page: data.page,
      lastSeen: data.lastSeen,
    });
  });
  return NextResponse.json({
    count: activeVisitors.size,
    visitors,
  });
}

export async function POST(request: NextRequest) {
  const { visitorId, page } = await request.json();

  activeVisitors.set(visitorId, {
    page,
    lastSeen: Date.now(),
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const { visitorId } = await request.json();
  activeVisitors.delete(visitorId);
  return NextResponse.json({ success: true });
}