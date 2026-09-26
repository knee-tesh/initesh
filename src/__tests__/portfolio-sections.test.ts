import { portfolioNarrationSections, portfolioSectionIds } from '@/data/portfolio-sections';
import { portfolioData } from '@/data/portfolio';

const EXPECTED_IDS = [
  'overview',
  'impact',
  'leadership',
  'case-study',
  'experience',
  'expertise',
  'engagements',
  'contact',
];

describe('portfolio narration sections', () => {
  it('does not repeat the experience prefix in the overview', () => {
    const overview = portfolioNarrationSections.find((section) => section.id === 'overview');
    expect(overview?.text.match(/10\+ years/gi)).toHaveLength(1);
  });

  it('exposes exactly the page section ids in page order', () => {
    expect([...portfolioSectionIds]).toEqual(EXPECTED_IDS);
    expect(portfolioNarrationSections.map((section) => section.id)).toEqual(EXPECTED_IDS);
  });

  it('has no dangling legacy section ids', () => {
    const ids = portfolioNarrationSections.map((section) => section.id);

    for (const legacy of ['current-work', 'career', 'capabilities']) {
      expect(ids).not.toContain(legacy);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every section a title and narration text', () => {
    for (const section of portfolioNarrationSections) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.text.trim().length).toBeGreaterThan(40);
    }
  });

  it('narrates impact, the featured case study, and engagements from verified data', () => {
    const text = (id: string) =>
      portfolioNarrationSections.find((section) => section.id === id)?.text ?? '';

    expect(text('impact')).toContain('50K+ concurrent channels');
    expect(text('impact')).toContain(portfolioData.experience);
    expect(text('case-study')).toContain(portfolioData.currentWork.name);
    expect(text('case-study')).toContain(portfolioData.currentWork.scale);
    expect(text('engagements')).toContain(portfolioData.engagements[0].name);
    expect(text('engagements')).toContain(portfolioData.engagements[0].description);
    expect(text('engagements')).toContain(portfolioData.engagements[2].name);
    expect(text('engagements')).not.toMatch(/testimonial/i);
    expect(text('leadership')).toContain('RFC reviews');
    expect(text('contact')).toContain(portfolioData.contact.email);
  });
});
