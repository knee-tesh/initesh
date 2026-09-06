export function parseTourTag(reply: string): { slug: string | null; clean: string } {
  const match = reply.match(/\[show:page:([a-z-]+)\]/);
  const clean = reply.replace(/\s*\[show:page:[a-z-]+\]\s*/g, ' ').trim();
  return { slug: match?.[1] ?? null, clean };
}