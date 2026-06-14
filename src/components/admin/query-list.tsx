'use client';

import { useState } from 'react';
import type { Query } from '@/lib/types';

export default function QueryList({ queries: initial }: { queries: Query[] }) {
  const [queries, setQueries] = useState(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function markRead(id: string) {
    await fetch(`/api/admin/queries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    });
    setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'read' } : q)));
  }

  async function markReplied(id: string) {
    await fetch(`/api/admin/queries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'replied' }),
    });
    setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'replied' } : q)));
  }

  const unread = queries.filter((q) => q.status === 'new').length;

  return (
    <div className="space-y-2">
      <h2 className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        Queries {unread > 0 && <span style={{ color: 'var(--accent)' }}>({unread} unread)</span>}
      </h2>
      <div className="space-y-2">
        {queries.map((q) => (
          <div key={q.id} className="process-card p-3 rounded-sm">
            <button
              onClick={() => {
                setExpandedId(expandedId === q.id ? null : q.id);
                if (q.status === 'new') markRead(q.id);
              }}
              className="w-full text-left"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                  {q.name}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {new Date(q.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-xs truncate" style={{ color: 'var(--muted)' }}>
                {q.email} — {q.message.slice(0, 80)}{q.message.length > 80 ? '...' : ''}
              </div>
            </button>
            {expandedId === q.id && (
              <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--fg)' }}>{q.message}</p>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${q.email}?subject=Re: Your query&body=Hi ${q.name},`}
                    className="keyboard-nav text-xs px-2 py-1 rounded-sm underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    Reply via Email
                  </a>
                  {q.status !== 'replied' && (
                    <button
                      onClick={() => markReplied(q.id)}
                      className="keyboard-nav text-xs px-2 py-1 rounded-sm"
                      style={{ color: 'var(--muted)' }}
                    >
                      Mark Replied
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
