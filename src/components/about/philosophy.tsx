import about from "@/data/about.json";

export default function Philosophy() {
  return (
    <section className="bg-surface border border-border rounded-lg p-6">
      <h2 className="text-xs uppercase tracking-[2px] text-accent mb-4 font-[family-name:var(--font-mono)]">
        Philosophy
      </h2>
      <ul className="space-y-3">
        {about.philosophy.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-muted">
            <span className="text-mint mt-0.5">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
