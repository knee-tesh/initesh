import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// ponytail: Vercel/Next function timeout caps reply length; short replies only (client also enforces 500 chars).
export async function POST(request: NextRequest) {
  if (!process.env.MURF_API_KEY) {
    return NextResponse.json({ error: 'TTS not configured' }, { status: 501 });
  }

  let body: any;
  try { body = await request.json(); } catch { body = {}; }
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  if (!text || text.length > 500) {
    return NextResponse.json({ error: 'Text is required (max 500 chars)' }, { status: 400 });
  }

  if (!rateLimit(request, { prefix: 'tts', limit: 15 })) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  const voiceId = process.env.MURF_VOICE_ID ?? 'en-IN-priya';

  return await new Promise<Response>((resolve) => {
    let ws: WebSocket;
    try {
      ws = new WebSocket(
        `wss://api.murf.ai/v1/speech/stream-input?api-key=${process.env.MURF_API_KEY}&sample_rate=44100`
      );
    } catch {
      resolve(NextResponse.json({ error: 'AI service error' }, { status: 502 }));
      return;
    }

    let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
    let started = false;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try { ws.close(); } catch {}
      if (controller) {
        try { controller.close(); } catch {}
        controller = null;
      }
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({
        voice_config: { voiceId },
        text,
        inference_params: { modelVersion: 'FALCON' },
      }));
      ws.send(JSON.stringify({ end: true }));
    };

    ws.onmessage = (m) => {
      let data: any;
      try { data = JSON.parse(String(m.data)); } catch { return; }
      if (data.audio) {
        const bytes = new Uint8Array(Buffer.from(data.audio, 'base64'));
        if (!started) {
          started = true;
          const stream = new ReadableStream<Uint8Array>({
            start(c) { controller = c; try { c.enqueue(bytes); } catch {} },
            cancel() { finish(); },
          });
          resolve(new Response(stream, { headers: { 'Content-Type': 'application/octet-stream' } }));
        } else if (controller) {
          try { controller.enqueue(bytes); } catch {}
        }
      } else if (data.final) {
        finish();
      } else if (data.error || data.error_code || data.errorCode) {
        console.error('Murf WS error:', String(m.data).slice(0, 300));
        finish();
      }
    };

    ws.onerror = () => {
      finish();
    };
    ws.onclose = () => {
      if (!started) {
        resolve(NextResponse.json({ error: 'AI service error' }, { status: 502 }));
      }
      finish();
    };
    setTimeout(finish, 60000);
  });
}
