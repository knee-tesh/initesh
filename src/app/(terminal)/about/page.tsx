import ProcessCard from "@/components/process-card";
import about from "@/data/about.json";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>
          about.d (PID 3)
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          My story, philosophy, and career timeline.
        </p>
      </div>

      <section className="space-y-4">
        {about.narrative.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>
            {paragraph}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
          Philosophy
        </h2>
        <ul className="space-y-2">
          {about.philosophy.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--accent)" }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
          Principles
        </h2>
        <ul className="space-y-2">
          {about.principles.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--accent)" }}>▸</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>
          Timeline
        </h2>
        <div className="space-y-0 border-l" style={{ borderColor: "var(--border)" }}>
          {about.timeline.map((entry, i) => (
            <div key={i} className="relative pl-4 pb-4">
              <div
                className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {entry.year}
              </div>
              <div className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                {entry.role}
              </div>
              <div className="text-xs" style={{ color: "var(--accent)" }}>
                {entry.org}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {entry.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
