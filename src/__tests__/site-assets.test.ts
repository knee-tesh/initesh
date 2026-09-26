import { closeSync, existsSync, openSync, readSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, 'public');
const RESUME_PDF = 'Nitesh-Tiwari-Principal-Software-Engineer-Resume.pdf';

const LEGACY_ICONS = [
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'site.webmanifest',
];

describe('public asset surface', () => {
  it('serves the reviewed app router icons with no public shadow', () => {
    expect(existsSync(join(ROOT, 'src/app/favicon.ico'))).toBe(true);
    expect(existsSync(join(ROOT, 'src/app/icon.svg'))).toBe(true);
    expect(existsSync(join(PUBLIC_DIR, 'favicon.ico'))).toBe(false);
  });

  it('keeps only the resume pdf in public', () => {
    expect(readdirSync(PUBLIC_DIR).sort()).toEqual([RESUME_PDF]);
  });

  it('leaves no unwired pwa manifest or legacy icon set behind', () => {
    const publicFiles = readdirSync(PUBLIC_DIR);

    for (const legacy of LEGACY_ICONS) {
      expect(publicFiles).not.toContain(legacy);
    }
  });

  it('serves the resume pdf at the path the page links to', () => {
    const fd = openSync(join(PUBLIC_DIR, RESUME_PDF), 'r');
    const header = Buffer.alloc(5);

    try {
      readSync(fd, header, 0, 5, 0);
      expect(header.toString()).toBe('%PDF-');
    } finally {
      closeSync(fd);
    }
  });
});
