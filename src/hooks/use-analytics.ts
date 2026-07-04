'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
  const pathname = usePathname();
  const sessionId = useRef<string>(crypto.randomUUID());
  const pageLoadTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      const visitDuration = Date.now() - pageLoadTime.current;

      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          sessionId: sessionId.current,
          visitDuration,
          scrollDepth: maxScrollDepth.current,
        }),
      }).catch(() => {});
    };
  }, [pathname]);
}
