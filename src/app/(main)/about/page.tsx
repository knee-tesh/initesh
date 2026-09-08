import SectionHeading from "@/components/shared/section-heading";
import about from "@/data/about.json";

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="About"
        title="Who I Am"
        kicker={about.narrative[0]}
      />

      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
          What I Work On
        </h2>
        <div className="space-y-3">
          {about.narrative.slice(1).map((p, i) => (
            <p key={i} className="text-text leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
          What I Care About
        </h2>
        <div className="space-y-px bg-border border border-border rounded-lg overflow-hidden">
          {about.philosophy.map((item, i) => (
            <div key={i} className="bg-surface p-6 md:p-8">
              <p className="text-text leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-4">
          Outside Engineering
        </h2>
        {/* TODO(content): outside engineering interests */}
        <p className="text-sm text-muted italic">Coming soon.</p>
      </section>
    </div>
  );
}
