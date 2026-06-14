'use client';

import { useEffect, useState } from 'react';
import type { Visitor, Query, VisitorStats } from '@/lib/types';
import StatsPanel from './stats-panel';
import VisitorList from './visitor-list';
import QueryList from './query-list';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/visitors').then((r) => r.json()),
      fetch('/api/admin/queries').then((r) => r.json()),
    ]).then(([s, v, q]) => {
      setStats(s);
      setVisitors(v);
      setQueries(q);
      setLoading(false);
    });
  }, []);

  async function handleExport() {
    const res = await fetch('/api/admin/export', { method: 'POST' });
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="text-sm" style={{ color: 'var(--muted)' }}>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>
          admin.dashboard (PID 0)
        </h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="keyboard-nav text-xs px-3 py-1 rounded-sm" style={{ color: 'var(--accent)' }}>
            Export JSON
          </button>
          <button onClick={onLogout} className="keyboard-nav text-xs px-3 py-1 rounded-sm" style={{ color: 'var(--muted)' }}>
            Logout
          </button>
        </div>
      </div>

      {stats && <StatsPanel stats={stats} />}
      <VisitorList visitors={visitors} />
      <QueryList queries={queries} />
    </div>
  );
}
