export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>
  )[c]);
}

export function validateContact(body: unknown):
  | { ok: true; value: { name: string; email: string; message: string; company?: string } }
  | { ok: false; error: string } {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'Invalid payload' };
  const b = body as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const message = typeof b.message === 'string' ? b.message.trim() : '';
  const company = typeof b.company === 'string' ? b.company.trim() : '';
  if (!name) return { ok: false, error: 'Name is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Valid email is required' };
  if (!message) return { ok: false, error: 'Message is required' };
  if (name.length > 500 || email.length > 254 || message.length > 500 || company.length > 500) {
    return { ok: false, error: 'Fields too long' };
  }
  return { ok: true, value: { name, email, message, ...(company ? { company } : {}) } };
}