import SectionHeading from "@/components/shared/section-heading";

const LEVERAGE = [
  { title: "Architecture", body: "Define technical direction for complex systems." },
  { title: "Influence", body: "Align multiple teams around difficult decisions." },
  { title: "Engineering Standards", body: "Create patterns, RFCs, tooling and governance." },
  { title: "Mentorship", body: "Develop stronger Senior and Staff engineers." },
];

export default function Leverage() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Leverage"
          title="How I Create Leverage"
          kicker="The ways I multiply impact beyond my own output."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEVERAGE.map((l) => (
            <div key={l.title} className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-accent">
                {l.title}
              </h3>
              <p className="mt-3 text-muted leading-relaxed">{l.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
