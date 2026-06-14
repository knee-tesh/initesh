'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/admin-login';
import AdminDashboard from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

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
      <AdminDashboard onLogout={() => setAuthenticated(false)} />
    </div>
  );
}
