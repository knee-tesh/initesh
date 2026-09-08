import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ErrorBoundary from "@/components/shared/error-boundary";
import AtAGlance from "@/components/work/case-study/at-a-glance";
import DecisionBlock from "@/components/work/case-study/decision-block";
import FailureModeComponent from "@/components/work/case-study/failure-mode";
import MoreWork from "@/components/work/more-work";
import { caseStudies } from "@/data/case-studies";

const TODO_PLACEHOLDER = "Content pending truth-layer verification.";

export function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const study = caseStudies.find((s) => s.slug === slug);
    if (!study) return {};
    return { title: study.title, description: study.summary };
  });
}

function Placeholder({ text = TODO_PLACEHOLDER }: { text?: string }) {
  return <p className="text-sm text-muted italic">{text}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">{title}</h2>
      <div className="text-text leading-relaxed">{children}</div>
    </section>
  );
}

function isTODO(val: unknown): boolean {
  return typeof val === "string" && val.startsWith("TODO");
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) notFound();

  const problemParts = study.problem.split("\n").filter(Boolean);

  return (
    <ErrorBoundary>
      <article className="max-w-3xl mx-auto space-y-10 py-12">
        {/* Header */}
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {study.company} · {study.domain}
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-text font-[family-name:var(--font-display)]">
            {study.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {study.role} · {study.timeframe} · {study.scale}
          </p>
        </header>

        {/* Executive Summary */}
        <Section title="Executive Summary">
          <p>{study.summary}</p>
        </Section>

        {/* At a Glance */}
        <AtAGlance study={study} />

        {/* Problem */}
        <Section title="Problem">
          {isTODO(study.problem) ? (
            <Placeholder />
          ) : (
            <div className="space-y-3">
              {problemParts.length > 1 ? (
                problemParts.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>{study.problem}</p>
              )}
            </div>
          )}
        </Section>

        {/* My Responsibility */}
        <Section title="My Responsibility">
          {study.responsibility?.length && !isTODO(study.responsibility[0]) ? (
            <ul className="list-disc list-inside space-y-1">
              {study.responsibility.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <Placeholder />
          )}
        </Section>

        {/* Architecture */}
        <Section title="Architecture">
          {study.technologies?.length ? (
            <p className="mb-4">
              {study.technologies.join(" · ")}
            </p>
          ) : null}
          {/* ponytail: ArchitectureDiagram slots in during Task 10 */}
          <Placeholder text="Architecture diagram — coming in Task 10." />
        </Section>

        {/* Key Decisions */}
        {study.decisions?.length > 0 && (
          <section>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">Key Decisions</h2>
            <div className="space-y-4">
              {study.decisions.map((d, i) => (
                <DecisionBlock key={i} decision={d} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Trade-offs */}
        <Section title="Trade-offs">
          {study.decisions?.some((d) => d.tradeoff && !isTODO(d.tradeoff)) ? (
            <ul className="list-disc list-inside space-y-1">
              {study.decisions
                .filter((d) => d.tradeoff && !isTODO(d.tradeoff))
                .map((d, i) => (
                  <li key={i}>{d.tradeoff}</li>
                ))}
            </ul>
          ) : (
            <Placeholder />
          )}
        </Section>

        {/* Failure Modes */}
        {study.failureModes?.length > 0 && (
          <section>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">Failure Modes</h2>
            <div className="space-y-4">
              {study.failureModes.map((fm, i) => (
                <FailureModeComponent key={i} mode={fm} />
              ))}
            </div>
          </section>
        )}

        {/* Execution */}
        <Section title="Execution">
          {isTODO(study.execution) ? <Placeholder /> : <p>{study.execution}</p>}
        </Section>

        {/* Impact */}
        <Section title="Impact">
          <div className="space-y-4">
            {(["technicalImpact", "businessImpact", "organizationalImpact"] as const).map((key) => {
              const val = study[key];
              const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
              return (
                <div key={key}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
                  {isTODO(val) ? <Placeholder /> : <p className="mt-1 text-text">{val}</p>}
                </div>
              );
            })}
          </div>
        </Section>

        {/* What I Would Change Today */}
        <Section title="What I Would Change Today">
          {isTODO(study.lessonsLearned) ? <Placeholder /> : <p>{study.lessonsLearned}</p>}
        </Section>

        {/* Related Work */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">Related Work</h2>
          <MoreWork />
        </section>
      </article>
    </ErrorBoundary>
  );
}
