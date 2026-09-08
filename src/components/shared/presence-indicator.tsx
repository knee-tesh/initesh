'use client';

import { usePresence } from '@/hooks/use-presence';

export function PresenceIndicator() {
  const activeCount = usePresence();

  if (activeCount <= 1) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-linen/80 backdrop-blur-sm border border-hem rounded text-xs text-stone font-[family-name:var(--font-script)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
        </span>
        <span className="text-stone">
          {activeCount} {activeCount === 1 ? 'visitor' : 'visitors'} online
        </span>
      </div>
    </div>
  );
}
