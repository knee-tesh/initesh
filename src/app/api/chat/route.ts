import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { buildPortfolioPrompt } from '@/lib/portfolio-context';

const systemPrompt = buildPortfolioPrompt();

// ponytail: in-memory = per-instance; fine for a portfolio, switch to libsql if multi-instance.
export async function POST(request: NextRequest) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is not configured' }, { status: 500 });
  }

  if (!rateLimit(request, { prefix: 'chat', limit: 10 })) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const sanitized = (Array.isArray(body?.messages) ? body.messages : [])
    .slice(-10)
    .map((m: any) => ({
      role: m?.role === 'assistant' ? 'assistant' : 'user',
      content: String(m?.content ?? '').slice(0, 1000),
    }))
    .filter((m: any) => m.content);

  if (sanitized.length === 0) {
    return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
  }

  try {
    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        stream: true,
        reasoning_effort: null,
        max_tokens: 500,
        temperature: 0.3,
        messages: [{ role: 'system', content: systemPrompt }, ...sanitized],
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      console.error('Sarvam API error:', response.status, errText.slice(0, 500));
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat service unavailable' }, { status: 503 });
  }
}
