import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '@/components/layout/footer';
import SiteHeader from '@/components/layout/site-header';
import { portfolioData } from '@/data/portfolio';

const headerSource = readFileSync(join(process.cwd(), 'src/components/layout/site-header.tsx'), 'utf8');
const footerSource = readFileSync(join(process.cwd(), 'src/components/layout/footer.tsx'), 'utf8');
const header = renderToStaticMarkup(<SiteHeader />);
const footer = renderToStaticMarkup(<Footer />);
const text = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const monogram = portfolioData.profile.name
  .split(' ')
  .map((part) => part[0])
  .join('');

describe('chrome identity provenance', () => {
  it('hardcodes no identity, monogram, or email literal in the header or footer', () => {
    for (const source of [headerSource, footerSource]) {
      expect(source).toContain('portfolioData');
      expect(source).not.toContain('Nitesh');
      expect(source).not.toContain('@gmail.com');
      expect(source).not.toContain(portfolioData.profile.name);
      expect(source).not.toContain(portfolioData.contact.email);
      expect(source).not.toMatch(/>[A-Z]{2,}</);
    }
  });

  it('renders the name, monogram, and email from the data source', () => {
    for (const html of [header, footer]) {
      expect(text(html)).toContain(`${portfolioData.profile.name}, back to top`);
      expect(text(html)).toContain(monogram);
    }
    expect(text(footer)).toContain(portfolioData.contact.email);
    expect(footer).toContain(`href="mailto:${portfolioData.contact.email}"`);
  });
});
