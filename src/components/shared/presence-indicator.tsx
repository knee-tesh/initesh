'use client';

import { usePresence } from '@/hooks/use-presence';

export function PresenceIndicator() {
  const activeCount = usePresence();

  if (activeCount <= 1) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-elevated/80 backdrop-blur-sm border border-border rounded text-xs text-muted font-[family-name:var(--font-script)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        <span className="text-muted">
          {activeCount} {activeCount === 1 ? 'visitor' : 'visitors'} online
        </span>
      </div>
    </div>
  );
}
