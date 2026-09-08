import SectionHeading from "@/components/shared/section-heading";
import CareerTimeline from "@/components/experience/career-timeline";

const THEMES = [
  {
    title: "Technical Influence",
    body: "Defining architectural direction across teams and platforms.",
  },
  {
    title: "Mentoring",
    body: "Growing engineers through code review, pairing, and design critique.",
  },
  {
    title: "Governance",
    body: "Establishing standards that scale — review processes, RFC workflows, production readiness.",
  },
  {
    title: "Standards",
    body: "Setting technical bar for quality, reliability, and operability.",
  },
];

export default function ExperiencePage() {
  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Career"
        title="Experience"
        kicker="Roles, leadership, and the systems I've built across teams and organizations."
      />

      <CareerTimeline />

      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-6">
          Leadership Themes
        </h2>
        <div className="space-y-px bg-border border border-border rounded-lg overflow-hidden">
          {THEMES.map((theme) => (
            <div key={theme.title} className="bg-surface p-6 md:p-8">
              <h3 className="text-lg font-semibold text-text">{theme.title}</h3>
              <p className="mt-2 text-muted leading-relaxed">{theme.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
