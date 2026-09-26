import { portfolioData } from '@/data/portfolio';
import { buildPortfolioPrompt } from '@/lib/portfolio-context';

describe('buildPortfolioPrompt', () => {
  it('includes the approved identity, work, career, capabilities, engagements, and contact sections', () => {
    const prompt = buildPortfolioPrompt();

    expect(prompt).toContain('## Identity');
    expect(prompt).toContain('Principal Software Engineer');
    expect(prompt).toContain('Genesys Telecom');
    expect(prompt).toContain('Bangalore, India');
    expect(prompt).toContain('## Leadership');
    expect(prompt).toContain('Set technical direction');
    expect(prompt).toContain('Raise engineering quality');
    expect(prompt).toContain('Multiply engineers');
    expect(prompt).toContain('## Current work');
    expect(prompt).toContain('Genesys BYOI Platform');
    expect(prompt).toContain('50K+ concurrent channels');
    expect(prompt).toContain('## Career');
    expect(prompt).toContain('Hitachi Digital Services');
    expect(prompt).toContain('## Capabilities');
    expect(prompt).toContain('d3.js');
    expect(prompt).toContain('ECharts');
    expect(prompt).toContain('## Selected engagements');
    expect(prompt).toContain('GuardEye Enterprises');
    expect(prompt).toContain(portfolioData.engagements[0].description);
    expect(prompt).not.toMatch(/testimonial/i);
    expect(prompt).toContain('Aatmiya Foundation');
    expect(prompt).toContain('## Contact');
    expect(prompt).toContain('tiwari.nitesh294@gmail.com');
    expect(prompt).toContain('https://www.linkedin.com/in/itiwarinitesh/');
    expect(prompt).toContain('https://github.com/knee-tesh');
    expect(prompt).toContain('## Suggested questions');
    expect(prompt.length).toBeLessThan(8000);
  });

  it('sets portfolio-only, concise, safe fallback, and no-navigation rules', () => {
    const prompt = buildPortfolioPrompt().toLowerCase();

    expect(prompt).toContain('answer only questions about nitesh tiwari’s portfolio');
    expect(prompt).toContain('do not answer general or external questions');
    expect(prompt).toContain('do not use outside sources');
    expect(prompt).toContain('keep replies concise');
    expect(prompt).toContain('if the context does not contain the answer, say so');
    expect(prompt).toContain('use only the supplied portfolio context');
    expect(prompt).not.toMatch(/\[show:page:[^\]]+\]/i);
    expect(prompt).not.toContain('page navigation');
    expect(prompt.replaceAll('hitachi digital services', '')).not.toMatch(/\bservices?\b/i);
    expect(prompt).not.toMatch(/\bpricing\b|\bprice\s*:/i);
  });

  it('uses the supplied profile name in the portfolio scope', () => {
    const customPortfolio = {
      ...portfolioData,
      profile: { name: 'Avery Example' },
    };

    const prompt = buildPortfolioPrompt(customPortfolio);

    expect(prompt).toContain('Avery Example’s portfolio');
    expect(prompt).not.toContain('Nitesh Tiwari’s portfolio');
  });

  it('uses the supplied portfolio without unsupported claims', () => {
    const customPortfolio = {
      ...portfolioData,
      title: 'Staff Engineer',
      summary: 'Staff Engineer with experience building and owning cloud-based applications.',
      currentWork: {
        ...portfolioData.currentWork,
        role: 'Staff Engineer',
        summary: 'Staff Engineer working on distributed platform systems.',
        scale: '10K+ concurrent channels',
      },
    };
    const prompt = buildPortfolioPrompt(customPortfolio).toLowerCase();

    expect(prompt).toContain('staff engineer');
    expect(prompt).toContain('10k+ concurrent channels');
    expect(prompt).not.toContain('10m events/day');
    expect(prompt).not.toContain('99.99%');
    expect(prompt).not.toContain('<100ms');
    expect(prompt).not.toContain('35% cost');
  });
});
