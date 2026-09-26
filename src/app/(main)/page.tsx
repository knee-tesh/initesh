import { NarrationTrigger } from '@/components/portfolio';
import { portfolioSectionIds } from '@/data/portfolio-sections';
import { portfolioData } from '@/data/portfolio';

const [overviewId, impactId, leadershipId, caseStudyId, experienceId, expertiseId, engagementsId, contactId] =
  portfolioSectionIds;

const RESUME_PATH = '/Nitesh-Tiwari-Principal-Software-Engineer-Resume.pdf';

const proof = [
  { value: portfolioData.experience, label: 'building and owning cloud applications and integrations', measured: true },
  { value: 'Enterprise scale', label: 'enterprise telephony platforms integrated into one cloud platform', measured: false },
  { value: 'End-to-end', label: 'architecture, delivery, reliability, and team ownership', measured: false },
];

const leadership = portfolioData.leadershipPillars;

const caseStudy = portfolioData.caseStudy;

const capabilities = portfolioData.capabilities;

function DownloadIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M12 4v10m0 0 4-4m-4 4-4-4M5 18h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M4 6h16v12H4zM4 7l8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RepositoryIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M9 19c-4 1.2-4-2.2-5.5-2.7M15 21v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.4 2.6 5.4 2.9 5.4 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.3c0 4.6 2.8 5.6 5.5 6a3 3 0 0 0-.8 2.2V21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Constellation() {
  const hub = { x: 320, y: 250 };
  const inner = [
    { x: 320, y: 108 },
    { x: 452, y: 172 },
    { x: 468, y: 336 },
    { x: 320, y: 404 },
    { x: 172, y: 336 },
    { x: 188, y: 172 },
  ];
  const spokes = [
    { x: 320, y: 28 },
    { x: 516, y: 96 },
    { x: 516, y: 404 },
    { x: 320, y: 472 },
    { x: 124, y: 404 },
    { x: 124, y: 96 },
  ];
  const outer = [...spokes, { x: 588, y: 250 }, { x: 52, y: 250 }];
  return (
    <svg
      className="portfolio-constellation"
      viewBox="0 0 640 520"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g className="portfolio-constellation-lines">
        {inner.map((node) => (
          <line key={`hub-${node.x}-${node.y}`} x1={hub.x} y1={hub.y} x2={node.x} y2={node.y} />
        ))}
        {inner.map((node, index) => {
          const spoke = spokes[index];
          return (
            <line
              key={`spoke-${spoke.x}-${spoke.y}`}
              x1={node.x}
              y1={node.y}
              x2={spoke.x}
              y2={spoke.y}
            />
          );
        })}
        <circle cx={hub.x} cy={hub.y} r="150" />
        <circle cx={hub.x} cy={hub.y} r="222" />
      </g>
      <g className="portfolio-constellation-flow">
        <path className="portfolio-flow" d="M320 250 C 360 190, 400 150, 452 172" />
        <path className="portfolio-flow" d="M320 250 C 400 280, 430 320, 468 336" />
        <path className="portfolio-flow" d="M320 250 C 280 320, 220 350, 172 336" />
      </g>
      <g className="portfolio-constellation-nodes">
        <circle cx={hub.x} cy={hub.y} r="11" />
        {inner.map((node) => (
          <circle key={`node-${node.x}-${node.y}`} cx={node.x} cy={node.y} r="6" />
        ))}
        {outer.map((node) => (
          <circle key={`edge-${node.x}-${node.y}`} cx={node.x} cy={node.y} r="4" />
        ))}
      </g>
      <g className="portfolio-constellation-channels">
        <rect x="470" y="196" width="26" height="4" rx="2" />
        <rect x="470" y="206" width="18" height="4" rx="2" />
        <rect x="470" y="216" width="10" height="4" rx="2" />
      </g>
    </svg>
  );
}

function SectionHead({
  eyebrow,
  title,
  lede,
  id,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  id: string;
}) {
  return (
    <header className="portfolio-section-head">
      <p className="portfolio-eyebrow">{eyebrow}</p>
      <h2 id={id} className="portfolio-h2 portfolio-display">
        {title}
      </h2>
      <p className="portfolio-lede">{lede}</p>
    </header>
  );
}

export default function HomePage() {
  return (
    <div className="portfolio-page">
      <section id={overviewId} className="portfolio-hero" aria-labelledby="portfolio-hero-title">
        <Constellation />
        <div className="portfolio-shell portfolio-hero-grid">
          <div className="portfolio-hero-copy portfolio-enter">
            <p className="portfolio-eyebrow">
              <span className="portfolio-eyebrow-dot" />
              {portfolioData.title}
            </p>
            <h1 id="portfolio-hero-title" className="portfolio-h1 portfolio-display portfolio-enter-delay-1">
              <span>Resilient platforms.</span> <span>Durable outcomes.</span>
            </h1>
            <p className="portfolio-lede portfolio-hero-summary portfolio-enter-delay-2">
              {portfolioData.summary}
            </p>
            <div className="portfolio-actions portfolio-enter-delay-3">
              <a
                className="portfolio-button portfolio-button-primary"
                href={RESUME_PATH}
                download
              >
                <DownloadIcon />
                Download résumé
              </a>
              <NarrationTrigger />
              <a
                className="portfolio-link"
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon />
                LinkedIn
              </a>
            </div>
          </div>
          <aside
            className="portfolio-glass portfolio-role-card portfolio-enter-delay-2"
            aria-label={`Current role at ${portfolioData.currentWork.company}`}
          >
            <p className="portfolio-label">Currently</p>
            <p className="portfolio-role-title">{portfolioData.currentWork.role}</p>
            <p className="portfolio-role-company">{portfolioData.currentWork.company}</p>
            <p className="portfolio-role-summary">{portfolioData.currentWork.summary}</p>
            <p className="portfolio-role-stat">
              <span className="portfolio-label">Experience</span>
              <span className="portfolio-role-stat-value">{portfolioData.experience}</span>
            </p>
            <ul className="portfolio-chips">
              {portfolioData.currentWork.technologies.map((technology) => (
                <li key={technology} className="portfolio-chip">
                  {technology}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section id={impactId} className="portfolio-section" aria-labelledby="portfolio-impact-title">
        <div className="portfolio-shell">
          <SectionHead
            eyebrow="Impact"
            id="portfolio-impact-title"
            title="Proof of scale and ownership"
            lede="Numbers I can defend in a systems design conversation, and the scope I carry around them."
          />
          <ul className="portfolio-proof">
            {proof.map((item) => (
              <li key={item.value} className="portfolio-glass portfolio-proof-card">
                <p
                  className={`portfolio-proof-value ${item.measured ? 'portfolio-metric' : 'portfolio-scope'}`}
                >
                  {item.value}
                </p>
                <p className="portfolio-body">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={leadershipId} className="portfolio-section" aria-labelledby="portfolio-leadership-title">
        <div className="portfolio-shell">
          <SectionHead
            eyebrow="Leadership"
            id="portfolio-leadership-title"
            title="Leadership, made operational"
            lede="Three responsibilities principals are expected to own: direction, standards, and the engineers who carry them."
          />
          <ul className="portfolio-pillars">
            {leadership.map((pillar) => (
              <li key={pillar.title} className="portfolio-pillar">
                <h3 className="portfolio-h3 portfolio-display">{pillar.title}</h3>
                <p className="portfolio-body">{pillar.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={caseStudyId} className="portfolio-section" aria-labelledby="portfolio-case-title">
        <div className="portfolio-shell">
          <SectionHead
            eyebrow="Featured system"
            id="portfolio-case-title"
            title="One platform, owned end to end"
            lede="A single enterprise story carries more weight than a grid of shallow project cards."
          />
          <article className="portfolio-case">
            <div className="portfolio-case-score">
              <p className="portfolio-label">{portfolioData.currentWork.name}</p>
              <p className="portfolio-case-value">{caseStudy.metric}</p>
              <p className="portfolio-case-caption">{caseStudy.caption}</p>
            </div>
            <div className="portfolio-glass portfolio-case-copy">
              <h3 className="portfolio-h3 portfolio-display">{caseStudy.role}</h3>
              <p className="portfolio-body">{portfolioData.currentWork.summary}</p>
              <ul className="portfolio-case-list">
                {caseStudy.contributions.map((contribution) => (
                  <li key={contribution} className="portfolio-body">
                    {contribution}
                  </li>
                ))}
              </ul>
              <ul className="portfolio-chips">
                {portfolioData.currentWork.technologies.map((technology) => (
                  <li key={technology} className="portfolio-chip">
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section id={experienceId} className="portfolio-section" aria-labelledby="portfolio-experience-title">
        <div className="portfolio-shell">
          <SectionHead
            eyebrow="Experience"
            id="portfolio-experience-title"
            title="A decade of increasing scope"
            lede="Five roles, each widening the scope I own, from observability integration to enterprise telephony platforms."
          />
          <ul className="portfolio-timeline">
            {[...portfolioData.career].reverse().map((role) => (
              <li key={role.period} className="portfolio-surface portfolio-timeline-item">
                <p className="portfolio-label">{role.period}</p>
                <h3 className="portfolio-h3 portfolio-display portfolio-timeline-role">{role.role}</h3>
                <p className="portfolio-timeline-company">{role.company}</p>
                <p className="portfolio-body portfolio-timeline-focus">{role.focus}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={expertiseId} className="portfolio-section" aria-labelledby="portfolio-expertise-title">
        <div className="portfolio-shell">
          <SectionHead
            eyebrow="Expertise"
            id="portfolio-expertise-title"
            title="Technical range with leadership depth"
            lede="Grouped by what the capability enables, not presented as a logo cloud."
          />
          <ul className="portfolio-capabilities">
            {capabilities.map((group) => (
              <li key={group.title} className="portfolio-surface portfolio-capability">
                <h3 className="portfolio-h3 portfolio-display">{group.title}</h3>
                <ul className="portfolio-chips">
                  {group.items.map((item) => (
                    <li key={item} className="portfolio-chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={engagementsId} className="portfolio-section" aria-labelledby="portfolio-engagements-title">
        <div className="portfolio-shell">
          <SectionHead
            eyebrow="Selected engagements"
            id="portfolio-engagements-title"
            title="Delivery outside the enterprise core"
            lede="Small, outcome-focused proof of shipping without diluting the platform story."
          />
          <ul className="portfolio-engagements">
            {portfolioData.engagements.map((engagement) => (
              <li key={engagement.name} className="portfolio-surface portfolio-engagement">
                <p className="portfolio-label">{engagement.kind}</p>
                <h3 className="portfolio-h3 portfolio-display">{engagement.name}</h3>
                <p className="portfolio-body">{engagement.description}</p>
                <ul className="portfolio-chips">
                  {engagement.technologies.map((technology) => (
                    <li key={technology} className="portfolio-chip">
                      {technology}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id={contactId} className="portfolio-section" aria-labelledby="portfolio-contact-title">
        <div className="portfolio-shell portfolio-contact">
          <div className="portfolio-contact-copy">
            <p className="portfolio-eyebrow">Contact</p>
            <h2 id="portfolio-contact-title" className="portfolio-h2 portfolio-display">
              Let&rsquo;s build something consequential.
            </h2>
            <p className="portfolio-lede">
              Open to principal, staff, and enterprise engineering leadership conversations in{' '}
              {portfolioData.location}.
            </p>
          </div>
          <ul className="portfolio-contact-actions">
            <li>
              <a className="portfolio-button portfolio-button-primary" href={`mailto:${portfolioData.contact.email}`}>
                <MailIcon />
                Email Nitesh
              </a>
            </li>
            <li>
              <a
                className="portfolio-button portfolio-button-quiet"
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                className="portfolio-button portfolio-button-quiet"
                href={portfolioData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RepositoryIcon />
                GitHub
              </a>
            </li>
            <li>
              <a className="portfolio-button portfolio-button-quiet" href={RESUME_PATH} download>
                <DownloadIcon />
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
