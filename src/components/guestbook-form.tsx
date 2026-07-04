'use client';

import { useState } from 'react';

export default function GuestbookForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
    };

    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        const body = await res.json();
        setErrorMsg(body.error ?? 'Something went wrong');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error — please try again');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-surface border border-border p-4 rounded-sm">
        <p className="text-sm text-accent">
          [✓] Query logged. Response expected within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs block mb-1 text-muted font-[family-name:var(--font-mono)]" htmlFor="gb-name">
          NAME
        </label>
        <input
          type="text"
          id="gb-name"
          name="name"
          required
          minLength={2}
          maxLength={100}
          className="keyboard-nav w-full border border-border px-3 py-2 text-sm rounded-sm bg-transparent text-text"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="text-xs block mb-1 text-muted font-[family-name:var(--font-mono)]" htmlFor="gb-email">
          EMAIL
        </label>
        <input
          type="email"
          id="gb-email"
          name="email"
          required
          className="keyboard-nav w-full border border-border px-3 py-2 text-sm rounded-sm bg-transparent text-text"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="text-xs block mb-1 text-muted font-[family-name:var(--font-mono)]" htmlFor="gb-message">
          MESSAGE
        </label>
        <textarea
          id="gb-message"
          name="message"
          rows={4}
          required
          minLength={10}
          maxLength={1000}
          className="keyboard-nav w-full border border-border px-3 py-2 text-sm rounded-sm bg-transparent text-text resize-y"
          placeholder="Your query or message..."
        />
      </div>
      {status === 'error' && (
        <p className="text-xs" style={{ color: '#ef4444' }}>
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="keyboard-nav bg-accent text-void px-4 py-2 text-sm rounded-sm disabled:opacity-50 font-semibold hover:opacity-90 transition-opacity"
      >
        {status === 'submitting' ? 'Sending...' : 'Submit Query'}
      </button>
    </form>
  );
}
