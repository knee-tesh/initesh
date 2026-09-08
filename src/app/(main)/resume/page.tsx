import about from "@/data/about.json";
import contact from "@/data/contact.json";
import PrintButton from "@/components/resume/print-button";

const SKILLS = [
  "Serverless Architecture",
  "AWS Lambda & Step Functions",
  "Event-Driven Systems",
  "Distributed Systems",
  "d3.js & Data Visualization",
  "ELK Stack",
  "SaaS Platform Engineering",
];

export default function ResumePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header className="space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text">Nitesh Tiwari</h1>
            <p className="text-accent font-mono text-sm">Principal Software Engineer</p>
          </div>
          <PrintButton />
        </div>
        <p className="text-sm text-muted">
          {contact.email} · {contact.location}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Summary</h2>
        {about.narrative.map((p, i) => (
          <p key={i} className="text-muted leading-relaxed">{p}</p>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Experience</h2>
        <div className="space-y-4">
          {about.timeline.map((item) => (
            <div key={item.year} className="border-l-2 border-border pl-4">
              <p className="font-mono text-xs text-muted">{item.year}</p>
              <p className="text-text font-medium">{item.role} <span className="text-accent">@ {item.org}</span></p>
              <p className="text-sm text-muted mt-1">{item.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Skills / Focus Areas</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="px-3 py-1 text-xs font-mono bg-surface border border-border rounded text-muted">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
