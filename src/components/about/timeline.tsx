import about from "@/data/about.json";
import Medallion from "@/components/shared/medallion";

export default function Timeline() {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[2px] text-terracotta mb-6 font-[family-name:var(--font-script)]">
        Career Path
      </h2>
      <div className="border-l-2 border-hem pl-6 space-y-6">
        {about.timeline.map((entry, i) => (
          <div key={i} className="relative">
            <Medallion className="absolute -left-[35px] top-1.5 w-5 h-5 border-teal text-gold" />
            <div className="text-xs text-stone font-[family-name:var(--font-script)]">{entry.year}</div>
            <div className="text-sm font-semibold text-ink mt-1">{entry.role}</div>
            <div className="text-sm text-teal">{entry.org}</div>
            <div className="text-xs text-stone mt-1">{entry.highlight}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
