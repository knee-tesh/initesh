import { escapeHtml, validateContact } from '@/lib/email';

describe('escapeHtml', () => {
  it('escapes & < > " and \'', () => {
    expect(escapeHtml(`<b>&"'</b>`)).toBe('&lt;b&gt;&amp;&quot;&#39;&lt;/b&gt;');
  });
});

describe('validateContact', () => {
  const ok = () => ({ name: 'Neha', email: 'n@example.com', message: 'hi' });

  it('accepts a valid payload', () => {
    const r = validateContact(ok());
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toMatchObject({ name: 'Neha', email: 'n@example.com', message: 'hi' });
  });

  it('accepts optional company', () => {
    expect(validateContact({ ...ok(), company: 'Acme' }).ok).toBe(true);
  });

  it('rejects missing name/message/bad email', () => {
    expect(validateContact({ ...ok(), name: '' }).ok).toBe(false);
    expect(validateContact({ ...ok(), message: '' }).ok).toBe(false);
    expect(validateContact({ ...ok(), email: 'nope' }).ok).toBe(false);
    expect(validateContact(null).ok).toBe(false);
  });

  it('rejects over-long fields', () => {
    expect(validateContact({ ...ok(), name: 'x'.repeat(501) }).ok).toBe(false);
    expect(validateContact({ ...ok(), message: 'x'.repeat(501) }).ok).toBe(false);
  });
});