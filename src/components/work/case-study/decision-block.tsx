import type { CaseStudy } from "@/data/case-studies";

type Decision = CaseStudy["decisions"][number];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="mt-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <div className="mt-1 text-sm text-text leading-relaxed">{children}</div>
    </div>
  );
}

export default function DecisionBlock({ decision, index }: { decision: Decision; index: number }) {
  const hasContent = decision.title || decision.chosen || decision.why;
  if (!hasContent) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <p className="font-mono text-xs text-accent">
        Decision {String(index + 1).padStart(2, "0")}
      </p>
      {decision.title && (
        <h4 className="mt-1 text-lg font-semibold text-text">{decision.title}</h4>
      )}

      {decision.options?.length > 0 && (
        <Row label="Options Considered">
          <ul className="list-disc list-inside space-y-0.5">
            {decision.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </Row>
      )}

      <Row label="Decision">{decision.chosen}</Row>
      <Row label="Why">{decision.why}</Row>
      <Row label="Trade-off">{decision.tradeoff}</Row>
      <Row label="Outcome">{decision.outcome}</Row>
    </div>
  );
}
