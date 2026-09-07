import { parseTourTag } from '@/lib/tour-tag';

describe('parseTourTag', () => {
  it('takes the first tag and returns its slug', () => {
    expect(parseTourTag('See my work. [show:page:projects] [show:page:about]').slug).toBe('projects');
  });

  it('strips ALL tags from the clean text', () => {
    const { clean } = parseTourTag('See my work. [show:page:projects] sure [show:page:about]');
    expect(clean).toBe('See my work. sure');
  });

  it('returns null slug and unchanged text when no tag', () => {
    const { slug, clean } = parseTourTag('Just answering.');
    expect(slug).toBeNull();
    expect(clean).toBe('Just answering.');
  });
});