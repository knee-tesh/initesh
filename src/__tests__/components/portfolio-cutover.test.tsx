import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import MainLayout from '@/app/(main)/layout';
import { usePortfolioNarration } from '@/components/portfolio/narration';
import { portfolioSectionIds } from '@/data/portfolio-sections';

const source = readFileSync(join(process.cwd(), 'src/app/(main)/layout.tsx'), 'utf8');

const CHROME = [
  'class="portfolio-header"',
  '<main id="main-content"',
  'class="portfolio-footer"',
  'class="portfolio-dock',
  'class="portfolio-chat',
];

function NarrationProbe() {
  const { section, status } = usePortfolioNarration();

  return <span data-status={status}>{section?.id ?? 'none'}</span>;
}

describe('portfolio layout cutover', () => {
  it('stays a server component that only wraps client controls', () => {
    expect(source).not.toMatch(/(['"])use client\1/);
  });

  it('mounts the retained chrome in rendered order', () => {
    const html = renderToStaticMarkup(
      <MainLayout>
        <p>page</p>
      </MainLayout>,
    );
    const positions = CHROME.map((marker) => html.indexOf(marker));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((left, right) => left - right)).toEqual(positions);
  });

  it('provides the page narration sections to the page subtree', () => {
    const html = renderToStaticMarkup(
      <MainLayout>
        <NarrationProbe />
      </MainLayout>,
    );

    expect(html).toContain(`>${portfolioSectionIds[0]}<`);
  });

  it('drops the retired chrome from the layout', () => {
    for (const retired of [
      'CommandPaletteProvider',
      'ChatWidget',
      'PresenceIndicator',
      'use-presence',
      'MobileMenu',
    ]) {
      expect(source).not.toContain(retired);
    }
  });
});
