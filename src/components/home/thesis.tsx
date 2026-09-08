const PRINCIPLES = [
  { id: "01", title: "Architecture Should Reduce Complexity", body: "The best architecture is not the one with the most components. It is the one that makes future change easier." },
  { id: "02", title: "Own It End-to-End", body: "You build it, you run it, you support it." },
  { id: "03", title: "AI Is a Force Multiplier", body: "Automate anything that can be automated." },
  { id: "04", title: "Reduce Cognitive Load", body: "Architecture reduces cognitive load, not abstraction layers." },
];

export default function Thesis() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-12">
          Engineering Thesis
        </h2>
        <div className="space-y-px bg-border border border-border rounded-lg overflow-hidden">
          {PRINCIPLES.map((p) => (
            <div key={p.id} className="grid grid-cols-[auto_1fr] gap-6 bg-surface p-6 md:p-8 items-start">
              <span className="font-mono text-3xl text-accent">{p.id}</span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-text">{p.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
