'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useVisitorTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tracked = sessionStorage.getItem('tracked_pages');
    const trackedPages: string[] = tracked ? JSON.parse(tracked) : [];

    if (trackedPages.includes(pathname)) return;

    trackedPages.push(pathname);
    sessionStorage.setItem('tracked_pages', JSON.stringify(trackedPages));

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  }, [pathname]);
}
