import { portfolioData } from '@/data/portfolio';

export type PortfolioNarrationSection = {
  id: string;
  title: string;
  text: string;
};

export const portfolioSectionIds = [
  'overview',
  'impact',
  'leadership',
  'case-study',
  'experience',
  'expertise',
  'engagements',
  'contact',
] as const;

const { currentWork, experience, contact } = portfolioData;

const proof = [
  `${currentWork.scale} on ${currentWork.name}`,
  `${experience} building and owning cloud applications and integrations`,
  'end-to-end architecture, delivery, reliability, and team ownership',
].join('; ');

export const portfolioNarrationSections: PortfolioNarrationSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    text: `${portfolioData.summary} The work spans cloud platforms, distributed systems, and product engineering.`,
  },
  {
    id: 'impact',
    title: 'Impact',
    text: `The scale I work at: ${proof}.`,
  },
  {
    id: 'leadership',
    title: 'Engineering leadership',
    text: portfolioData.leadershipPillars
      .map(({ title, description }) => `${title}. ${description}`)
      .join(' '),
  },
  {
    id: 'case-study',
    title: 'Featured case study',
    text: `${currentWork.name} — ${currentWork.role} at ${currentWork.company}. ${currentWork.summary} The platform supports ${currentWork.scale} and is built on ${currentWork.technologies.join(', ')}.`,
  },
  {
    id: 'experience',
    title: 'Career trajectory',
    text: portfolioData.career
      .map(({ period, role, company, focus }) => `${period}: ${role} at ${company}. ${focus}`)
      .join(' '),
  },
  {
    id: 'expertise',
    title: 'Capabilities',
    text: portfolioData.capabilities
      .map(({ title, items }) => `${title}: ${items.join(', ')}`)
      .join(' '),
  },
  {
    id: 'engagements',
    title: 'Selected engagements',
    text: portfolioData.engagements
      .map(({ name, kind, description, technologies }) => `${name} (${kind}). ${description} Built with ${technologies.join(', ')}.`)
      .join(' '),
  },
  {
    id: 'contact',
    title: 'Contact',
    text: `Reach ${portfolioData.profile.name} by email at ${contact.email}, on LinkedIn at ${contact.linkedin}, or on GitHub at ${contact.github}. Based in ${contact.location}.`,
  },
];
