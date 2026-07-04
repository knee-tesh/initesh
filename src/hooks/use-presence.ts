'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function usePresence() {
  const pathname = usePathname();
  const visitorId = useRef<string>(crypto.randomUUID());
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // Register presence on mount
    const register = () => {
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: visitorId.current,
          page: pathname,
        }),
      }).catch(() => {});
    };

    // Heartbeat every 30 seconds
    const interval = setInterval(register, 30000);
    register();

    // Fetch active count
    const fetchCount = () => {
      fetch('/api/presence')
        .then(res => res.json())
        .then(data => setActiveCount(data.count))
        .catch(() => {});
    };

    fetchCount();
    const countInterval = setInterval(fetchCount, 10000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearInterval(countInterval);
      fetch('/api/presence', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: visitorId.current }),
      }).catch(() => {});
    };
  }, [pathname]);

  return activeCount;
}
