'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/admin-login';
import AdminDashboard from '@/components/admin/admin-dashboard';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        setAuthenticated(res.ok);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Verifying access...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <AdminLogin onLogin={() => setAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex gap-4 mb-6 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`text-sm font-mono ${activeTab === 'overview' ? 'text-accent' : 'text-muted hover:text-text'}`}
        >
          $ overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`text-sm font-mono ${activeTab === 'analytics' ? 'text-accent' : 'text-muted hover:text-text'}`}
        >
          $ analytics
        </button>
      </div>
      {activeTab === 'overview' && <AdminDashboard onLogout={() => setAuthenticated(false)} />}
      {activeTab === 'analytics' && <AnalyticsDashboard />}
    </div>
  );
}
