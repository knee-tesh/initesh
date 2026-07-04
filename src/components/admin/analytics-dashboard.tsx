'use client';

import { useEffect, useState } from 'react';
import type { AnalyticsData } from '@/lib/types';
import TerminalWindow from '@/components/shared/terminal-window';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch analytics');
        return res.json();
      })
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <TerminalWindow title="analytics">
        <div className="text-sm" style={{ color: 'var(--muted)' }}>
          $ loading analytics...
        </div>
      </TerminalWindow>
    );
  }

  if (error) {
    return (
      <TerminalWindow title="analytics">
        <div className="text-sm" style={{ color: 'var(--accent)' }}>
          $ error: {error}
        </div>
      </TerminalWindow>
    );
  }

  if (!analytics) return null;

  const maxTraffic = Math.max(...analytics.trafficOverTime.map((d) => d.count));

  return (
    <div className="space-y-6">
      <TerminalWindow title="analytics --overview">
        <div className="space-y-4">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            $ analytics --metrics
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Visits', value: analytics.totalVisits.toLocaleString() },
              { label: 'Unique Sessions', value: analytics.uniqueSessions.toLocaleString() },
              { label: 'Avg Duration', value: `${Math.round(analytics.avgDuration)}s` },
              { label: 'Avg Scroll', value: `${Math.round(analytics.avgScrollDepth)}%` },
            ].map((item) => (
              <div key={item.label} className="process-card p-3 rounded-sm">
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{item.label}</div>
                <div className="text-lg font-bold" style={{ color: 'var(--fg)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>

      <TerminalWindow title="traffic --timeline">
        <div className="space-y-4">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            $ traffic --timeline --last-30-days
          </div>
          <div className="flex items-end gap-1 h-32">
            {analytics.trafficOverTime.map((day) => (
              <div
                key={day.date}
                className="flex-1 rounded-t"
                style={{
                  height: `${maxTraffic > 0 ? (day.count / maxTraffic) * 100 : 0}%`,
                  backgroundColor: 'var(--accent)',
                  minHeight: day.count > 0 ? '4px' : '0',
                }}
                title={`${day.date}: ${day.count} visits`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
            <span>{analytics.trafficOverTime[0]?.date}</span>
            <span>{analytics.trafficOverTime[analytics.trafficOverTime.length - 1]?.date}</span>
          </div>
        </div>
      </TerminalWindow>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TerminalWindow title="devices --breakdown">
          <div className="space-y-4">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              $ devices --breakdown
            </div>
            <div className="space-y-2">
              {analytics.deviceBreakdown.map((device) => {
                const total = analytics.deviceBreakdown.reduce((sum, d) => sum + d.count, 0);
                const percentage = total > 0 ? Math.round((device.count / total) * 100) : 0;
                return (
                  <div key={device.type} className="process-card p-2 rounded-sm">
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: 'var(--fg)' }}>{device.type}</span>
                      <span style={{ color: 'var(--muted)' }}>{percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded" style={{ backgroundColor: 'var(--border)' }}>
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: 'var(--accent)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TerminalWindow>

        <TerminalWindow title="referrers --top">
          <div className="space-y-4">
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              $ referrers --top --limit=5
            </div>
            <div className="space-y-1">
              {analytics.topReferrers.slice(0, 5).map((ref) => (
                <div key={ref.referrer} className="process-card p-2 rounded-sm flex justify-between text-sm">
                  <span style={{ color: 'var(--fg)' }}>{ref.referrer || 'Direct'}</span>
                  <span style={{ color: 'var(--muted)' }}>{ref.count}</span>
                </div>
              ))}
              {analytics.topReferrers.length === 0 && (
                <div className="text-sm" style={{ color: 'var(--muted)' }}>No referrers found</div>
              )}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
