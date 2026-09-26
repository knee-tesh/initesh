import { portfolioData } from '@/data/portfolio';

describe('portfolioData', () => {
  it('uses the canonical identity and current company', () => {
    expect(portfolioData.profile.name).toBe('Nitesh Tiwari');
    expect(portfolioData).not.toHaveProperty('name');
    expect(portfolioData.title).toBe('Principal Software Engineer');
    expect(portfolioData.company).toBe('Genesys Telecom');
  });

  it('keeps the approved portfolio sections and contact links', () => {
    expect(portfolioData.leadershipPillars).toHaveLength(3);
    expect(portfolioData.currentWork.scale).toBe('50K+ concurrent channels');
    expect(portfolioData.career.length).toBeGreaterThan(0);
    expect(portfolioData.capabilities.length).toBeGreaterThan(0);
    expect(portfolioData.engagements.map(({ name }) => name)).toEqual([
      'GuardEye Enterprises',
      'Aatmiya Foundation',
      'd3.js and ECharts visualization library',
    ]);
    expect(portfolioData.suggestedQuestions).toHaveLength(4);
    expect(portfolioData.contact).toEqual({
      email: 'tiwari.nitesh294@gmail.com',
      location: 'Bangalore, India',
      linkedin: 'https://www.linkedin.com/in/itiwarinitesh/',
      github: 'https://github.com/knee-tesh',
    });
  });

  it('contains no unsupported metrics or services and pricing language', () => {
    const content = JSON.stringify(portfolioData).toLowerCase().replaceAll('hitachi digital services', '');

    for (const phrase of ['10m events/day', '99.99%', '<100ms', '35% cost']) {
      expect(content).not.toContain(phrase);
    }
    for (const pattern of [/\bservices?\b/, /\bpricing\b/, /\bprice\b/]) {
      expect(content).not.toMatch(pattern);
    }
  });
  it('describes the GuardEye engagement as the catalog, lead-generation, and quote-request build', () => {
    const guardEye = portfolioData.engagements.find(({ name }) => name === 'GuardEye Enterprises');
    const description = guardEye?.description ?? '';

    expect(description).toMatch(/product catalog/i);
    expect(description).toMatch(/lead[- ]generation/i);
    expect(description).toMatch(/quote requests?/i);
    expect(description).not.toMatch(/testimonial/i);
  });

  it('carries verified people-leadership content and practice-based capability items', () => {
    const [, , multiply] = portfolioData.leadershipPillars;

    for (const practice of ['Code review', 'pairing', 'design critique', 'RFC reviews', 'autonomy']) {
      expect(multiply.description).toContain(practice);
    }
    expect(portfolioData.leadershipPillars.map(({ title }) => title)).toEqual([
      'Set technical direction',
      'Raise engineering quality',
      'Multiply engineers',
    ]);

    const leadership = portfolioData.capabilities.find((group) => group.title === 'Leadership');
    expect(leadership?.items).toEqual(['RFCs', 'System design', 'Mentoring', 'Production readiness']);
    expect(portfolioData.capabilities.map(({ title }) => title)).toEqual([
      'Cloud & platforms',
      'Backend systems',
      'Architecture',
      'Leadership',
    ]);
    for (const group of portfolioData.capabilities) {
      expect(group.items.length).toBeGreaterThan(0);
      expect(new Set(group.items).size).toBe(group.items.length);
    }
  });

  it('owns the featured case metric, role, and contributions in one typed source', () => {
    expect(Object.keys(portfolioData)).toContain('caseStudy');

    const { caseStudy, currentWork } = portfolioData;

    expect(caseStudy.metric).toBe('50K+');
    expect(caseStudy.metricLabel).toBe('concurrent channels');
    expect(caseStudy.role).toBe('Principal Architect / Technical Lead');
    expect(caseStudy.contributions).toHaveLength(3);
    expect(caseStudy.caption.length).toBeGreaterThan(0);
    expect(currentWork.scale).toBe(`${caseStudy.metric} ${caseStudy.metricLabel}`);
  });

  it('keeps the developer tooling in typed data without presenting it as leadership', () => {
    expect(portfolioData.tooling).toEqual(expect.arrayContaining(['Git', 'JIRA']));
    const serialized = JSON.stringify(portfolioData);
    const leadership = portfolioData.capabilities.find((group) => group.title === 'Leadership');

    for (const tool of ['Claude', 'Codex', 'Cursor', 'Git', 'Linux', 'JIRA']) {
      expect(leadership?.items).not.toContain(tool);
    }
    expect(serialized).toContain('JIRA');
  });
});
