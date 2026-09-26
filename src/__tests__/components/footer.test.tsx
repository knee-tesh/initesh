import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '@/components/layout/footer';
import { portfolioData } from '@/data/portfolio';

const footer = renderToStaticMarkup(<Footer />);
const footerText = footer.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const hrefs = [...footer.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);
const PAGE_SECTIONS = ['overview', 'impact', 'leadership', 'case-study', 'experience', 'expertise', 'engagements', 'contact'];
const LEGACY_ROUTES = ['/work', '/architecture', '/experience', '/writing', '/about', '/contact'];

describe('single-page footer', () => {
  it('links only to sections of the current page', () => {
    const nav = footer.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
    const targets = [...nav.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);

    expect(targets.length).toBeGreaterThan(0);
    for (const href of targets) {
      expect(href.startsWith('/#')).toBe(true);
      expect(PAGE_SECTIONS).toContain(href.replace('/#', ''));
    }
    for (const route of LEGACY_ROUTES) {
      expect(hrefs).not.toContain(route);
      expect(footer).not.toContain(`href="${route}"`);
    }
  });

  it('carries the identity and the contact details', () => {
    expect(footerText).toContain(portfolioData.profile.name);
    expect(footerText).toContain(portfolioData.contact.email);
  });

  it('uses no testimonial, service, or pricing language', () => {
    const lower = footerText.toLowerCase();
    for (const phrase of ['testimonial', 'service', 'pricing', 'price']) {
      expect(lower).not.toContain(phrase);
    }
  });

  it('renders inside the 1200px shell with no sub-12px text', () => {
    expect(footer).toContain('portfolio-shell');
    const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');
    expect(css).toMatch(/--fc-shell:\s*1200px/);
    expect(footer).not.toMatch(/text-\[1[01]px\]|text-\[9px\]/);
    const navRule = css.match(/\.portfolio-footer-nav a\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(navRule).toMatch(/min-height:\s*44px/);
    expect(navRule).toMatch(/font-size:\s*0\.75rem/);
  });
});
