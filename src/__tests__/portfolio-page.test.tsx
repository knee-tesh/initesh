import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import HomePage from '@/app/(main)/page';
import Footer from '@/components/layout/footer';
import SiteHeader from '@/components/layout/site-header';
import { PortfolioNarrationProvider } from '@/components/portfolio/narration';
import { portfolioNarrationSections, portfolioSectionIds } from '@/data/portfolio-sections';
import { portfolioData } from '@/data/portfolio';

const RESUME_PATH = '/Nitesh-Tiwari-Principal-Software-Engineer-Resume.pdf';
const HERO_TITLE = 'Resilient platforms. Durable outcomes.';
const SECTION_IDS = [...portfolioSectionIds];
const NAV_TARGETS = ['impact', 'leadership', 'experience', 'expertise', 'contact'];

const page = renderToStaticMarkup(
  <PortfolioNarrationProvider sections={portfolioNarrationSections}>
    <HomePage />
  </PortfolioNarrationProvider>,
);
const header = renderToStaticMarkup(<SiteHeader />);
const footer = renderToStaticMarkup(<Footer />);
const layoutSource = readFileSync(join(process.cwd(), 'src/app/(main)/layout.tsx'), 'utf8');
const pageSource = readFileSync(join(process.cwd(), 'src/app/(main)/page.tsx'), 'utf8');
const section = (id: string) =>
  page.match(new RegExp(`<section id="${id}"[\\s\\S]*?(?=<section id=|$)`))?.[0] ?? '';

const visible = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const pageText = visible(page);
const resumeAnchors =
  page.match(/<a[^>]*href="\/Nitesh-Tiwari-Principal-Software-Engineer-Resume\.pdf"[^>]*>/g) ?? [];

describe('frosted clarity portfolio page', () => {
  it('leads with the canonical hero, the verified summary, and a resume action', () => {
    expect(page.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(visible(page.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '')).toBe(HERO_TITLE);
    expect(pageText).toContain(portfolioData.title);
    expect(pageText).toContain(portfolioData.summary);
    expect(resumeAnchors.length).toBeGreaterThan(0);
    expect(resumeAnchors[0]).toMatch(/\bdownload\b/);
    expect(pageText).toContain('Listen to this page');
    expect(page).toContain(`href="${portfolioData.contact.linkedin}"`);
  });

  it('shows the 50K+ scale once, only inside the dark featured case panel', () => {
    const casePanel = section('case-study');

    expect(pageText.match(/50K\+/g)).toHaveLength(1);
    expect(casePanel).toContain('50K+');
    expect(casePanel).toContain('portfolio-case-score');
    expect(section('impact')).not.toContain('50K+');
    expect(section('overview')).not.toContain('50K+');
  });

  it('renders the featured case from the caseStudy source with no page-level literals', () => {
    for (const literal of ['50K+', 'Principal Architect', 'Technical Lead', 'Cross-team alignment']) {
      expect(pageSource).not.toContain(literal);
    }

    const panel = section('case-study');

    expect(panel).toContain(portfolioData.caseStudy.metric);
    expect(panel).toContain(portfolioData.caseStudy.role);
    expect(panel).toContain(portfolioData.caseStudy.caption);
    for (const contribution of portfolioData.caseStudy.contributions) {
      expect(panel).toContain(contribution);
    }
    expect(pageText.match(/50K\+/g)).toHaveLength(1);
  });

  it('separates measured metrics from scope statements in the proof rail', () => {
    const proof = section('impact').match(/<ul class="portfolio-proof[\s\S]*?<\/ul>/)?.[0] ?? '';
    const values = [...proof.matchAll(/portfolio-proof-value[^>]*>([^<]+)</g)].map((match) => match[1].trim());

    expect(values).toEqual(['10+ years', 'Enterprise scale', 'End-to-end']);
    expect(proof).toMatch(/portfolio-metric/);
    expect(proof).toMatch(/portfolio-scope/);
  });

  it('renders every leadership pillar from the data source', () => {
    const pillars = section('leadership');
    const items = [...pillars.matchAll(/<li class="portfolio-pillar"[\s\S]*?<\/li>/g)].map((match) => match[0]);

    expect(items).toHaveLength(portfolioData.leadershipPillars.length);
    portfolioData.leadershipPillars.forEach((pillar, index) => {
      expect(items[index]).toContain(pillar.title);
      expect(items[index]).toContain(pillar.description);
    });
    expect(pillars).toContain('Code review');
    expect(pillars).toContain('RFC reviews');
    expect(pillars).toContain('autonomy');
  });

  it('renders all four capability groups verbatim from the data source', () => {
    const blocks = section('expertise').split('<li class="portfolio-surface portfolio-capability"').slice(1);

    expect(blocks).toHaveLength(portfolioData.capabilities.length);
    portfolioData.capabilities.forEach((group, index) => {
      const chips = [...blocks[index].matchAll(/class="portfolio-chip">([^<]+)</g)].map((match) => match[1].trim());
      expect(visible(blocks[index])).toContain(group.title);
      expect(chips).toEqual(group.items);
    });
    const leadership = blocks[portfolioData.capabilities.length - 1];
    expect(leadership).toContain('RFCs');
    expect(leadership).toContain('Production readiness');
    for (const tool of portfolioData.tooling) {
      expect(leadership).not.toContain(tool);
    }
  });

  it('uses the authoritative section ids for the page and the narration', () => {
    const rendered = [...page.matchAll(/<section id="([^"]+)"/g)].map((match) => match[1]);

    expect(rendered).toEqual(SECTION_IDS);
    expect(portfolioNarrationSections.map(({ id }) => id)).toEqual(rendered);
    for (const id of rendered) {
      expect(page).toContain(`<section id="${id}"`);
    }
    for (const legacy of ['current-work', 'career', 'capabilities']) {
      expect(rendered).not.toContain(legacy);
      expect(portfolioNarrationSections.map(({ id }) => id)).not.toContain(legacy);
    }
  });

  it('describes the timeline by scope rather than a category order', () => {
    const lede = section('experience').match(/portfolio-lede">([^<]+)</)?.[1] ?? '';

    expect(lede).toMatch(/scope/i);
    expect(lede).not.toMatch(/consulting, product/i);
  });

  it('renders the career timeline oldest first', () => {
    const rendered = [...section('experience').matchAll(/portfolio-timeline-company[^>]*>([^<]+)</g)].map((match) =>
      match[1].trim(),
    );

    expect(rendered).toEqual([
      'Tech Mahindra',
      'Propellor.ai',
      'DoctorC',
      'Hitachi Digital Services',
      portfolioData.company,
    ]);
  });

  it('anchors the footer to every on-page section', () => {
    const nav = footer.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const targets = [...nav.matchAll(/href="([^"]*)"/g)].map((match) => match[1].replace('/#', ''));

    expect(targets).toEqual([...SECTION_IDS].filter((id) => id !== 'overview'));
    for (const href of targets) {
      expect(SECTION_IDS).toContain(href);
    }
    for (const route of ['/work', '/architecture', '/experience', '/writing', '/about', '/contact']) {
      expect(footer).not.toContain(`href="${route}"`);
    }
    expect(footer.toLowerCase()).not.toMatch(/testimonial/);
  });

  it('does not mount the presence indicator in the main layout', () => {
    expect(layoutSource).not.toContain('PresenceIndicator');
    expect(layoutSource).not.toContain('use-presence');
  });

  it('carries the current role, scale, and focus in a glass card', () => {
    const card = section('overview').match(/<aside[\s\S]*?<\/aside>/)?.[0] ?? '';

    expect(card).toContain(portfolioData.currentWork.role);
    expect(card).toContain(portfolioData.currentWork.company);
    expect(card).toContain(portfolioData.experience);
    expect(card).not.toContain('50K+');
    for (const technology of portfolioData.currentWork.technologies) {
      expect(card).toContain(technology);
    }
  });

  it('presents the approved sections in reading order', () => {
    const positions = SECTION_IDS.map((id) => page.indexOf(`<section id="${id}"`));
    expect(positions.filter((position) => position === -1)).toEqual([]);
    expect([...positions].sort((left, right) => left - right)).toEqual(positions);
  });

  it('states leadership as unnumbered responsibilities', () => {
    for (const pillar of ['Set technical direction', 'Raise engineering quality', 'Multiply engineers']) {
      expect(pageText).toContain(pillar);
    }
    for (const pillar of portfolioData.leadershipPillars.slice(0, 2)) {
      expect(pageText).toContain(pillar.description);
    }
    expect(pageText).not.toMatch(/\b0[123]\b/);
  });

  it('leads the case study with the 50K+ score and the approved chips', () => {
    expect(pageText).toContain(portfolioData.currentWork.name);
    expect(pageText).toContain('Principal Architect');
    expect(pageText).toContain('Technical Lead');
    expect(pageText).toContain(portfolioData.currentWork.summary);
    for (const technology of ['Distributed systems', 'Event-driven architecture', 'AWS', 'Reliability']) {
      expect(pageText).toContain(technology);
    }
  });

  it('renders the verified career timeline, capability groups, and engagements', () => {
    for (const role of portfolioData.career) {
      expect(pageText).toContain(role.company);
      expect(pageText).toContain(role.role);
    }
    expect(pageText.match(/2024 – Present/g)).toHaveLength(1);
    for (const group of ['Cloud & platforms', 'Backend systems', 'Architecture', 'Leadership']) {
      expect(pageText).toContain(group);
    }
    for (const item of ['AWS Lambda', 'Node.js', 'PostgreSQL', 'System Design', 'Amazon Connect']) {
      expect(pageText).toContain(item);
    }
    for (const engagement of portfolioData.engagements) {
      expect(pageText).toContain(engagement.name);
      expect(pageText).toContain(engagement.description);
    }
  });

  it('closes with email, LinkedIn, GitHub, and the resume', () => {
    expect(page).toContain(`href="mailto:${portfolioData.contact.email}"`);
    expect(page).toContain(`href="${portfolioData.contact.linkedin}"`);
    expect(page).toContain(`href="${portfolioData.contact.github}"`);
    expect(page).toContain(`href="${RESUME_PATH}"`);
  });

  it('exposes semantic main, nav, and section landmarks', () => {
    expect(page).not.toMatch(/<main[\s>]/);
    expect(layoutSource).toMatch(/<main[^>]*id="main-content"/);
    expect(header).toMatch(/<nav[^>]*aria-label="Primary"/);
    expect(header).toMatch(/href="#main-content"/);
    for (const id of SECTION_IDS) {
      expect(page).toContain(`<section id="${id}"`);
    }
    expect(page).toMatch(/<svg[^>]*aria-hidden="true"/);
  });

  it('keeps one h1 and never skips a heading level', () => {
    const levels = [...page.matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
    expect(levels[0]).toBe(1);
    levels.slice(1).forEach((level, index) => {
      expect(level - levels[index]).toBeLessThanOrEqual(1);
    });
  });

  it('points every header anchor at a section on the page', () => {
    const nav = header.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const targets = [...nav.matchAll(/href="\/#([a-z-]+)"/g)].map((match) => match[1]);
    expect(targets).toEqual(NAV_TARGETS);
    for (const label of ['Impact', 'Leadership', 'Experience', 'Expertise', 'Contact']) {
      expect(visible(nav)).toContain(label);
    }
  });

  it('omits unsupported metrics, legacy sections, and testimonial blocks', () => {
    const lower = pageText.toLowerCase();
    for (const phrase of ['10m events/day', '99.99', '<100ms', '35% cost', 'pricing', 'dashboard', 'testimonial']) {
      expect(lower).not.toContain(phrase);
    }
    expect(page).not.toMatch(/<blockquote/);
  });
});
