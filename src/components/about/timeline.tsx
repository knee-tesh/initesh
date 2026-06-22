import about from "@/data/about.json";

export default function Timeline() {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[2px] text-accent mb-6 font-[family-name:var(--font-mono)]">
        Career Path
      </h2>
      <div className="border-l-2 border-border pl-6 space-y-6">
        {about.timeline.map((entry, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-accent border-2 border-void" />
            <div className="text-xs text-muted font-[family-name:var(--font-mono)]">{entry.year}</div>
            <div className="text-sm font-semibold text-text mt-1">{entry.role}</div>
            <div className="text-sm text-accent">{entry.org}</div>
            <div className="text-xs text-muted mt-1">{entry.highlight}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
