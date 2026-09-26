import { portfolioData } from '@/data/portfolio';
import { portfolioNarrationSections } from '@/data/portfolio-sections';
import { chunkNarration } from '@/lib/narration';

describe('chunkNarration', () => {
  it('returns no chunks for prose that is only whitespace', () => {
    expect(chunkNarration('')).toEqual([]);
    expect(chunkNarration('   \n\t  ')).toEqual([]);
  });

  it('keeps prose within the limit in a single chunk', () => {
    expect(chunkNarration('Nitesh leads the BYOI platform team.')).toEqual([
      'Nitesh leads the BYOI platform team.',
    ]);
  });

  it('collapses newlines and repeated spaces into single spaces', () => {
    expect(chunkNarration('  Leads the\n\nBYOI\tplatform team.  ')).toEqual([
      'Leads the BYOI platform team.',
    ]);
  });

  it('breaks on a sentence boundary rather than mid-sentence', () => {
    expect(chunkNarration('Alpha one two. Bravo three four. Charlie five six.', 30)).toEqual([
      'Alpha one two.',
      'Bravo three four.',
      'Charlie five six.',
    ]);
  });

  it('breaks a sentence that is longer than the limit on word boundaries', () => {
    expect(chunkNarration('aa bb cc dd ee ff gg hh ii jj', 11)).toEqual([
      'aa bb cc dd',
      'ee ff gg hh',
      'ii jj',
    ]);
  });

  it('keeps every chunk inside the limit when one word is longer than the limit', () => {
    expect(chunkNarration('abcdefgh', 3)).toEqual(['abc', 'def', 'gh']);
  });

  it('never exceeds the Murf limit and loses no words of long prose', () => {
    const prose = Array.from(
      { length: 60 },
      (_, i) => `Sentence ${i} carries a handful of plain words for narration.`,
    ).join(' ');

    const chunks = chunkNarration(prose);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeGreaterThanOrEqual(1);
      expect(chunk.length).toBeLessThanOrEqual(500);
    }
    expect(chunks.join(' ')).toBe(prose);
  });

  it('chunks the same prose identically on every call', () => {
    const prose = Array.from({ length: 40 }, (_, i) => `Clause ${i} needs a voice.`).join(' ');

    expect(chunkNarration(prose)).toEqual(chunkNarration(prose));
  });

  it.each([
    ['zero', 0],
    ['a negative limit', -1],
    ['a fractional limit', 12.5],
    ['a limit above the Murf maximum', 501],
  ])('refuses %s as a chunk limit', (_label, maxChars) => {
    expect(() => chunkNarration('Leads the BYOI platform team.', maxChars)).toThrow(
      /maxChars.*1.*500/,
    );
  });

  it('accepts the smallest and largest Murf-safe limits', () => {
    expect(chunkNarration('ab cd', 1)).toEqual(['a', 'b', 'c', 'd']);
    expect(chunkNarration('Leads the BYOI platform team.', 500)).toEqual([
      'Leads the BYOI platform team.',
    ]);
  });

  it('keeps every public portfolio prose field safe for Murf', () => {
    const fields = [
      portfolioData.summary,
      portfolioData.currentWork.summary,
      ...portfolioData.leadershipPillars.map(({ title, description }) => `${title}. ${description}`),
      ...portfolioData.engagements.map(({ description }) => description),
      ...portfolioNarrationSections.map(({ text }) => text),
    ];

    for (const field of fields) {
      const chunks = chunkNarration(field);
      expect(chunks.every((chunk) => chunk.length >= 1 && chunk.length <= 500)).toBe(true);
      expect(chunks.join(' ')).toBe(field);
    }
  });
});
