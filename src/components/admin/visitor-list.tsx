'use client';

import type { Visitor } from '@/lib/types';

export default function VisitorList({ visitors }: { visitors: Visitor[] }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        Recent Visitors (last {visitors.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--muted)' }}>
              <th className="text-left p-2 text-xs">Time</th>
              <th className="text-left p-2 text-xs">Page</th>
              <th className="text-left p-2 text-xs">Location</th>
              <th className="text-left p-2 text-xs">Browser</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="p-2" style={{ color: 'var(--muted)' }}>
                  {new Date(v.timestamp).toLocaleString()}
                </td>
                <td className="p-2" style={{ color: 'var(--fg)' }}>{v.page}</td>
                <td className="p-2" style={{ color: 'var(--fg)' }}>
                  {[v.city, v.country].filter(Boolean).join(', ') || '—'}
                </td>
                <td className="p-2 text-xs" style={{ color: 'var(--muted)' }}>
                  {v.userAgent?.slice(0, 50) ?? '—'}{v.userAgent && v.userAgent.length > 50 ? '...' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
