import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import nextConfig from '../../next.config.js';

const ROOT = process.cwd();
const APP = join(ROOT, 'src/app');
const CANONICAL = 'https://nitesh.in';

const filesUnder = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesUnder(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const routeFiles = (name: string) =>
  filesUnder(APP)
    .filter((path) => path.endsWith(`/${name}`))
    .map((path) => path.slice(ROOT.length + 1))
    .sort();

describe('production surface', () => {
  it('publishes exactly one public content route', () => {
    expect(routeFiles('page.tsx')).toEqual(['src/app/(main)/page.tsx']);
  });

  it('exposes only the chat and tts endpoints', () => {
    expect(routeFiles('route.ts')).toEqual([
      'src/app/api/chat/route.ts',
      'src/app/api/tts/route.ts',
    ]);
  });

  it('lists only the canonical base url in the sitemap', () => {
    const entries = sitemap();

    expect(entries).toHaveLength(1);
    expect(entries[0].url).toBe(CANONICAL);
    expect(entries.filter(({ url }) => url !== CANONICAL)).toEqual([]);
  });

  it('advertises only the canonical sitemap to crawlers', () => {
    expect(robots().sitemap).toBe(`${CANONICAL}/sitemap.xml`);
    expect(robots().rules).toEqual({ userAgent: '*', allow: '/' });
  });

  it('documents only the secrets the retained integrations read', () => {
    const example = readFileSync(join(ROOT, '.env.local.example'), 'utf8');
    const keys = example.match(/^[A-Z0-9_]+=/gm)?.map((line) => line.slice(0, -1)) ?? [];

    expect(keys.sort()).toEqual(['MURF_API_KEY', 'MURF_VOICE_ID', 'SARVAM_API_KEY']);
  });

  it('exposes a jest test script', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

    expect(pkg.scripts.test).toBe('jest');
  });

  it('drops the retired next config options', () => {
    expect(nextConfig).toEqual({ reactStrictMode: true });
    expect(nextConfig).not.toHaveProperty('appDir');
    expect(nextConfig).not.toHaveProperty('experimental');
    expect(nextConfig).not.toHaveProperty('redirects');
  });
});
