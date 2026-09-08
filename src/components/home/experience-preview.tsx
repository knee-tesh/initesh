import Link from "next/link";
import SectionHeading from "@/components/shared/section-heading";
import aboutData from "@/data/about.json";

const timeline = aboutData.timeline;

export default function ExperiencePreview() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Career Trajectory"
          kicker="A decade of shipping systems across startups and enterprises."
        />
        <div className="mt-12 space-y-px bg-border border border-border rounded-lg overflow-hidden">
          {timeline.map((item) => (
            <div
              key={item.year}
              className="grid grid-cols-[auto_1fr] gap-6 bg-surface p-6 md:p-8 items-start"
            >
              <span className="font-mono text-xs text-muted whitespace-nowrap">{item.year}</span>
              <div>
                <h3 className="text-lg font-semibold text-text">{item.role}</h3>
                <p className="text-sm text-accent">{item.org}</p>
                <p className="mt-2 text-muted leading-relaxed">{item.highlight}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/experience"
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent2 transition-colors"
          >
            View full experience &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
