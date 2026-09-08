import type { CaseStudy } from "@/data/case-studies";

const PLACEHOLDER = "Content pending truth-layer verification";

function Cell({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-surface border border-border rounded px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-0.5 text-sm text-text">
        {value || <span className="text-muted italic">{PLACEHOLDER}</span>}
      </p>
    </div>
  );
}

export default function AtAGlance({ study }: { study: CaseStudy }) {
  return (
    <section>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">At a Glance</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Cell label="Role" value={study.role} />
        <Cell label="Scale" value={study.scale} />
        <Cell label="Domain" value={study.domain} />
        <Cell label="Architecture" value={study.technologies?.join(", ")} />
        <Cell label="Timeframe" value={study.timeframe} />
        <Cell label="Company" value={study.company} />
      </div>
    </section>
  );
}
