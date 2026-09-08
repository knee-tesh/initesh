import aboutData from "@/data/about.json";

const SCOPE_FRAMING: Record<string, string> = {
  "Senior Software Engineer": "Building",
  "Full Stack Developer": "Building",
  "Frontend Developer": "Building",
  "Senior Consultant": "Architecting",
  "Principal Fullstack Developer": "Leading",
};

export default function CareerTimeline() {
  return (
    <div className="space-y-px bg-border border border-border rounded-lg overflow-hidden">
      {aboutData.timeline.map((item) => (
        <div
          key={item.year}
          className="grid grid-cols-[auto_1fr] gap-6 bg-surface p-6 md:p-8 items-start"
        >
          <span className="font-mono text-xs text-muted whitespace-nowrap">{item.year}</span>
          <div>
            <h3 className="text-lg font-semibold text-text">{item.role}</h3>
            <p className="text-sm text-accent">{item.org}</p>
            <p className="mt-2 text-muted leading-relaxed">
              {SCOPE_FRAMING[item.role] ?? ""} — {item.highlight}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
