import type { CaseStudy } from "@/data/case-studies";

type FailureMode = CaseStudy["failureModes"][number];

const STEPS = [
  { key: "name" as const, label: "Failure" },
  { key: "detection" as const, label: "Detection" },
  { key: "containment" as const, label: "Containment" },
  { key: "recovery" as const, label: "Recovery" },
  { key: "impact" as const, label: "User / Business Impact" },
] as const;

export default function FailureMode({ mode }: { mode: FailureMode }) {
  const hasContent = STEPS.some((s) => mode[s.key]);
  if (!hasContent) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      {STEPS.map(({ key, label }, i) => {
        const text = mode[key];
        if (!text) return null;
        return (
          <div key={key} className={i > 0 ? "mt-3" : undefined}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
            <p className="mt-1 text-sm text-text leading-relaxed">{text}</p>
          </div>
        );
      })}
    </div>
  );
}
