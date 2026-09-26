import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');
const layoutSource = readFileSync(join(process.cwd(), 'src/app/(main)/layout.tsx'), 'utf8');
const reducedMotion = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
const printBlock = css.slice(css.indexOf('@media print'));
const rule = (selector: string) => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`${escaped}\\s*(?:,[^{]*)?\\{([^}]*)\\}`))?.[1] ?? '';
};

describe('frosted clarity design system', () => {
  it('declares the approved core tokens as semantic variables', () => {
    for (const token of [
      '--fc-ink: #0F2A35',
      '--fc-ink-soft: #47636D',
      '--fc-ink-muted: #6B8189',
      '--fc-accent: #0B7285',
      '--fc-accent-deep: #075E6E',
      '--fc-sky: #38BDF8',
    ]) {
      expect(css).toContain(`${token};`);
    }
  });

  it('keeps focus rings visible and interactive targets at 44px', () => {
    expect(css).toMatch(/:focus-visible[^{]*\{[^}]*outline:/);
    expect(css).toMatch(/min-(?:height|block-size):\s*44px/);
  });

  it('offsets sticky overlays above and below the viewport content', () => {
    expect(css).toMatch(/scroll-padding-top:\s*(?:\d|calc\()/);
    expect(css).toMatch(/scroll-padding-bottom:\s*(?:\d|calc\()/);
    expect(css).not.toMatch(/scroll-margin-top/);
  });

  it('blurs glass surfaces selectively within the approved range', () => {
    expect(css).toMatch(/backdrop-filter:[^;]*blur\((?:1[2-9]|2[0-2])px\)/);
  });

  it('never hides content behind a scroll-driven animation', () => {
    expect(css).not.toMatch(/animation-timeline/);
    expect(css).not.toMatch(/\.portfolio-reveal/);
    expect(css).not.toMatch(/@keyframes portfolio-reveal/);
  });

  it('keeps only the page-load entrance and the constellation flow, both reduced-motion safe', () => {
    expect(css).toMatch(/\.portfolio-enter\b/);
    expect(css).toMatch(/\.portfolio-flow\b/);
    expect(reducedMotion).toMatch(/\.portfolio-enter/);
    expect(reducedMotion).toMatch(/\.portfolio-flow/);
    expect(reducedMotion).toMatch(/animation:\s*none/);
  });

  it('prints the final state and drops the floating overlays', () => {
    expect(printBlock).toMatch(/\.portfolio-dock[\s\S]*?display:\s*none/);
    expect(printBlock).toMatch(/\.portfolio-chat\b[\s\S]*?display:\s*none/);
    expect(printBlock).toMatch(/\.portfolio-chat-sheet[\s\S]*?display:\s*none/);
    expect(printBlock).toMatch(/\.portfolio-enter[\s\S]*?animation:\s*none/);
  });

  it('reserves footer space for the dock and the chat launcher', () => {
    expect(css).toMatch(/--fc-dock-reserve:\s*\d/);
    expect(css).not.toMatch(/--fc-launcher-size/);
    expect(rule('.portfolio-footer-inner')).toMatch(/padding-bottom:\s*var\(--fc-dock-reserve\)/);
    expect(rule('.portfolio-footer-meta')).toMatch(/padding-right:\s*var\(--fc-launcher-inline\)/);
  });

  it('keeps the expanded dock to a compact grid with a full-width progress row', () => {
    const active = rule('.portfolio-dock[data-dock-state="active"]');

    expect(active).toMatch(/display:\s*grid/);
    expect(active).toMatch(/grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
    expect(rule('.portfolio-dock progress')).toMatch(/grid-column:\s*1 \/ -1/);
    expect(rule('.portfolio-dock[data-dock-state="idle"]')).toMatch(/min-height:\s*48px/);
  });

  it('applies the safe area exactly once per floating control', () => {
    const dock = rule('.portfolio-dock');
    const chat = rule('.portfolio-chat');

    for (const block of [dock, chat]) {
      expect(block).toMatch(/bottom:\s*0;/);
      expect(block).not.toMatch(/bottom:\s*max\(/);
      expect(block).toMatch(/padding-bottom:[^;]*env\(safe-area-inset-bottom\)/);
    }
    expect(chat).toMatch(/right:\s*0;/);
    expect(dock).toMatch(/right:\s*var\(--fc-launcher-inline\)/);
  });

  it('anchors the chat sheet above the dock instead of the UA modal inset', () => {
    const sheet = rule('.portfolio-chat-sheet');

    expect(sheet).toMatch(/top:\s*auto/);
    expect(sheet).toMatch(/bottom:\s*calc\(var\(--fc-dock-reserve\)\s*\+\s*env\(safe-area-inset-bottom\)\)/);
    expect(sheet).not.toMatch(/(^|[\s;])(top|bottom):\s*[\d.]/);
  });

  it('caps the chat sheet against the viewport and scrolls rather than clipping', () => {
    const sheet = rule('.portfolio-chat-sheet');
    const maxHeight = sheet.match(/max-height:\s*([^;]+)/)?.[1] ?? '';

    expect(maxHeight).toContain('100dvh');
    expect(maxHeight).toContain('var(--fc-dock-reserve)');
    expect(maxHeight).toContain('var(--fc-header-height)');
    expect(sheet).toMatch(/overflow-y:\s*auto/);
    expect(sheet).not.toMatch(/overflow:\s*hidden/);
  });

  it('keeps only the Tailwind theme mappings the retained chrome resolves', () => {
    const theme = css.slice(css.indexOf('@theme inline'), css.indexOf('@layer base'));

    for (const mapping of ['--color-accent', '--color-on-accent', '--color-border']) {
      expect(theme).toContain(`${mapping}:`);
    }
    for (const dead of [
      '--color-bg',
      '--color-surface',
      '--color-elevated',
      '--color-text',
      '--color-muted',
      '--color-accent2',
      '--color-sky',
      '--color-void',
      '--color-paper',
      '--color-linen',
      '--color-card',
      '--color-ink',
      '--color-stone',
      '--color-hem',
      '--color-terracotta',
      '--color-teal',
      '--color-mint',
      '--color-blush',
      '--color-gold',
      '--color-lavender',
      '--font-display',
      '--font-body',
      '--font-script',
      '--font-code',
      '--font-mono',
    ]) {
      expect(theme).not.toContain(dead);
    }
  });

  it('drops the print utility class no retained markup uses', () => {
    expect(css).not.toContain('.print\\:hidden');
  });

  it('sizes the launcher footprint with a token instead of magic offsets', () => {
    expect(css).toMatch(/--fc-launcher-inline:\s*\d+px/);
    expect(css).not.toMatch(/right:\s*7rem/);
    expect(css).not.toMatch(/right:\s*104px/);
  });

  it('drives the dock variants from the state attribute the markup carries', () => {
    expect(css).toMatch(/\[data-dock-state="idle"\]/);
    expect(css).toMatch(/\[data-dock-state="active"\]/);
  });

  it('keeps the dock and the chat launcher on opposite sides at every width', () => {
    const dock = rule('.portfolio-dock');

    expect(dock).toMatch(/max-width:\s*min\(/);
    expect(dock).not.toMatch(/(^|[\s;])padding:/);
    expect(rule('.portfolio-chat-launcher')).not.toMatch(/(^|[\s;])(left|right|bottom):/);
  });

  it('gives the header and footer monogram a 44px hit area without changing the mark', () => {
    const monogram = rule('.portfolio-monogram');

    expect(monogram).toMatch(/min-height:\s*44px/);
    expect(monogram).toMatch(/min-width:\s*44px/);
    expect(monogram).toMatch(/justify-content:\s*center/);
    expect(monogram).toMatch(/align-items:\s*center/);
    expect(monogram).toMatch(/font-size:\s*1\.3rem/);
  });

  it('drops the presence indicator from the layout and the stylesheet', () => {
    expect(layoutSource).not.toContain('PresenceIndicator');
    expect(css).not.toMatch(/presence/i);
    expect(css).not.toMatch(/\.fixed\.bottom-4\.left-4/);
  });

  it('ships no dead rules for removed chrome', () => {
    expect(css).not.toMatch(/\.portfolio-main\b/);
    expect(css).not.toMatch(/speaking-bar/);
    expect(css).not.toMatch(/pulse-clay/);
    expect(css).not.toMatch(/marquee-track/);
  });
});
