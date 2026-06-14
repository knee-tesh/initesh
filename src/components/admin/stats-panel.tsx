import type { VisitorStats } from '@/lib/types';

export default function StatsPanel({ stats }: { stats: VisitorStats }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Visits', value: stats.totalVisits.toLocaleString() },
          { label: 'Unique Visitors', value: stats.uniqueVisitors.toLocaleString() },
          { label: 'Today', value: stats.todayVisits.toLocaleString() },
          { label: 'This Week', value: stats.weekVisits.toLocaleString() },
        ].map((item) => (
          <div key={item.label} className="process-card p-3 rounded-sm">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.label}</div>
            <div className="text-lg font-bold" style={{ color: 'var(--fg)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      <h2 className="text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        Top Pages
      </h2>
      <div className="space-y-1">
        {stats.topPages.map((p) => (
          <div key={p.page} className="process-card p-2 rounded-sm flex justify-between text-sm">
            <span style={{ color: 'var(--fg)' }}>{p.page}</span>
            <span style={{ color: 'var(--muted)' }}>
              {p.visits} visits ({p.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
