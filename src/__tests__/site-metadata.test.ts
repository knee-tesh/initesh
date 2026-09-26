jest.mock('next/font/google', () => ({
  Manrope: () => ({ variable: '--fc-font-display', className: '' }),
  IBM_Plex_Sans: () => ({ variable: '--fc-font-body', className: '' }),
}));

import { metadata } from '@/app/layout';

const TITLE = 'Nitesh Tiwari — Principal Software Engineer';
const DESCRIPTION =
  'Principal Software Engineer with 10+ years building cloud platforms, distributed systems, and event-driven integrations. Currently at Genesys Telecom, where the BYOI platform supports 50K+ concurrent channels.';

const openGraph = metadata.openGraph as Record<string, unknown>;
const twitter = metadata.twitter as Record<string, unknown>;

describe('root metadata', () => {
  it('anchors the canonical url at nitesh.in', () => {
    expect(String(metadata.metadataBase)).toBe('https://nitesh.in/');
    expect(new URL(String(metadata.alternates?.canonical), metadata.metadataBase ?? undefined).href).toBe(
      'https://nitesh.in/',
    );
    expect(new URL(String(openGraph.url)).href).toBe('https://nitesh.in/');
  });

  it('states the principal software engineer title and description', () => {
    expect(metadata.title).toBe(TITLE);
    expect(metadata.description).toBe(DESCRIPTION);
  });

  it('carries open graph and twitter basics', () => {
    expect(openGraph.title).toBe(TITLE);
    expect(openGraph.description).toBe(DESCRIPTION);
    expect(openGraph.siteName).toBe('Nitesh Tiwari');
    expect(openGraph.type).toBe('website');
    expect(twitter.card).toBe('summary');
    expect(twitter.title).toBe(TITLE);
    expect(twitter.description).toBe(DESCRIPTION);
  });
});
