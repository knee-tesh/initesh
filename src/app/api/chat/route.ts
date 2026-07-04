import { NextRequest, NextResponse } from 'next/server';
import about from '@/data/about.json';
import skills from '@/data/skills.json';
import projects from '@/data/projects.json';
import services from '@/data/services.json';
import contact from '@/data/contact.json';

function buildSystemPrompt(): string {
  const aboutText = about.narrative.join('\n');
  const philosophyText = about.philosophy.map((p: string) => `- ${p}`).join('\n');
  const timelineText = about.timeline.map((t: any) => `- ${t.year}: ${t.role} at ${t.org} — ${t.highlight}`).join('\n');

  const skillsByCategory: Record<string, string[]> = {};
  for (const s of skills as any[]) {
    (skillsByCategory[s.category] ??= []).push(`${s.name} (${s.depth}, ${s.years}yr${s.note ? ` — ${s.note}` : ''})`);
  }
  const skillsText = Object.entries(skillsByCategory)
    .map(([cat, items]) => `${cat}:\n${items.map(i => `  - ${i}`).join('\n')}`)
    .join('\n');

  const projectsText = (projects as any[]).map(p =>
    `- ${p.title} (${p.category}): ${p.description}\n  Tech: ${p.techStack.join(', ')}\n  Features: ${p.features.join(', ')}`
  ).join('\n');

  const servicesText = (services as any[]).map(s =>
    `- ${s.title} [${s.audience}]: ${s.description}\n  Price: ${s.priceRange}, Delivery: ${s.delivery}`
  ).join('\n');

  const contactText = `Email: ${contact.email}\nPhone: ${contact.phone}\nLocation: ${contact.location}\nLinkedIn: ${contact.linkedin}\nGitHub: ${contact.github}\nCalendar: ${contact.calendar}`;

  return `You are a helpful assistant answering questions about Nitesh Tiwari, a Principal Fullstack Developer based in Bangalore, India. Answer concisely using only the context below. If you don't know something, say so.

## About
${aboutText}

## Philosophy
${philosophyText}

## Career Timeline
${timelineText}

## Skills
${skillsText}

## Projects
${projectsText}

## Services
${servicesText}

## Contact
${contactText}`;
}

const systemPrompt = buildSystemPrompt();

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chat is not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sarvam-30b',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam API error:', response.status, errorText);
      return NextResponse.json({ error: 'Chat service unavailable' }, { status: 503 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? '';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Chat service unavailable' }, { status: 503 });
  }
}
