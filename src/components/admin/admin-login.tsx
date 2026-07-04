'use client';

import { useState } from 'react';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (res.ok) {
      onLogin();
    } else {
      setError('Access denied');
    }
  }

  return (
    <div className="bg-surface border border-border p-6 rounded-sm max-w-sm mx-auto">
      <h2 className="text-xs uppercase tracking-wider mb-4 text-muted font-[family-name:var(--font-mono)]">
        Authentication Required
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="keyboard-nav w-full border border-border px-3 py-2 text-sm rounded-sm bg-transparent text-text"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          placeholder="Enter admin password"
          autoFocus
        />
        {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="keyboard-nav bg-accent text-void px-4 py-2 text-sm rounded-sm w-full font-semibold hover:opacity-90 transition-opacity"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
