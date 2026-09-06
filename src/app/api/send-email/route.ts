import { NextRequest, NextResponse } from 'next/server';
import contact from '@/data/contact.json';
import { escapeHtml, validateContact } from '@/lib/email';

export async function POST(request: NextRequest) {
  if (!process.env.MAILERSEND_TOKEN || !process.env.MAILERSEND_FROM) {
    return NextResponse.json({ error: 'Email is not configured' }, { status: 502 });
  }

  let body: unknown;
  try { body = await request.json(); } catch { body = null; }
  const v = validateContact(body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }
  const { name, email, message, company } = v.value;

  const html = `
    <h3>New Portfolio Contact</h3>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
      <tr><td style="padding:8px;border:1px solid #ddd;">Name</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Email</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Company</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(company ?? '—')}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Message</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(message)}</td></tr>
    </table>`;
  const text = `New Portfolio Contact\n\nName: ${name}\nEmail: ${email}\nCompany: ${company ?? '—'}\nMessage: ${message}`;

  try {
    const resp = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MAILERSEND_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: process.env.MAILERSEND_FROM, name: process.env.MAILERSEND_FROM_NAME || 'Nitesh Portfolio' },
        to: [{ email: contact.email }],
        subject: `Portfolio Contact from ${name}${company ? ` — ${company}` : ''}`,
        text,
        html,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('MailerSend error:', resp.status, errText.slice(0, 500));
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('send-email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}