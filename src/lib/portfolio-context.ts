import { portfolioData, type PortfolioData } from '@/data/portfolio';

export function buildPortfolioPrompt(portfolio: PortfolioData = portfolioData): string {
  const profileName = portfolio.profile.name;
  const leadership = portfolio.leadershipPillars
    .map(({ title, description }) => `- ${title}: ${description}`)
    .join('\n');
  const career = portfolio.career
    .map(({ period, role, company, focus }) => `- ${period} — ${role}, ${company}: ${focus}`)
    .join('\n');
  const capabilities = portfolio.capabilities
    .map(({ title, items }) => `- ${title}: ${items.join(', ')}`)
    .join('\n');
  const engagements = portfolio.engagements
    .map(({ name, kind, description, technologies }) =>
      `- ${name} (${kind}): ${description}\n  Technologies: ${technologies.join(', ')}`,
    )
    .join('\n');
  const tooling = portfolio.tooling.join(', ');
  const questions = portfolio.suggestedQuestions.map((question) => `- ${question}`).join('\n');

  return [
    `You are a portfolio-only assistant for ${profileName}, currently a ${portfolio.title} at ${portfolio.company} in ${portfolio.location}.`,
    `Answer only questions about ${profileName}’s portfolio using the context below.`,
    'Do not answer general or external questions. Do not use outside sources.',
    'Keep replies concise, ideally 2–4 sentences.',
    'Use only the supplied portfolio context. If the context does not contain the answer, say so plainly.',
    'Do not invent metrics, outcomes, responsibilities, or claims that are not present.',
    'Never emit navigation tags or page directives.',
    '',
    '## Identity',
    `${profileName} — ${portfolio.title}`,
    `${portfolio.company} | ${portfolio.location} | ${portfolio.experience}`,
    portfolio.summary,
    '',
    '## Leadership',
    leadership,
    '',
    '## Current work',
    `${portfolio.currentWork.name} (${portfolio.currentWork.role}, ${portfolio.currentWork.company})`,
    portfolio.currentWork.summary,
    `Scale: ${portfolio.currentWork.scale}`,
    `Technologies: ${portfolio.currentWork.technologies.join(', ')}`,
    '',
    '## Career',
    career,
    '',
    '## Capabilities',
    capabilities,
    '',
    '## Tooling',
    tooling,
    '',
    '## Selected engagements',
    engagements,
    '',
    '## Contact',
    `Email: ${portfolio.contact.email}`,
    `Location: ${portfolio.contact.location}`,
    `LinkedIn: ${portfolio.contact.linkedin}`,
    `GitHub: ${portfolio.contact.github}`,
    '',
    '## Suggested questions',
    questions,
  ].join('\n');
}
