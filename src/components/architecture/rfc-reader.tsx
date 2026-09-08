import type { Rfc } from "@/data/rfcs";

function SectionBody({ body }: { body: string }) {
  const paragraphs = body.includes("\n") ? body.split("\n").filter(Boolean) : [body];
  const isTODO = body.startsWith("TODO");

  return (
    <div className={`text-text leading-relaxed ${isTODO ? "text-muted italic" : ""}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "mt-3" : undefined}>
          {p}
        </p>
      ))}
    </div>
  );
}

export default function RFCReader({ rfc }: { rfc: Rfc }) {
  return (
    <article className="max-w-3xl mx-auto space-y-10 py-12">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent">{rfc.id}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-border text-muted">
            {rfc.category}
          </span>
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-text font-[family-name:var(--font-display)]">
          {rfc.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {rfc.date} · {rfc.readMinutes} min read
        </p>
      </header>

      {/* Mobile TOC */}
      <details className="lg:hidden border border-border rounded-lg p-4">
        <summary className="font-mono text-xs text-muted cursor-pointer">Sections</summary>
        <nav className="mt-2 space-y-1">
          {rfc.sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block font-mono text-xs text-muted hover:text-accent transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>
      </details>

      {/* Desktop: sticky TOC + sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
        <nav className="hidden lg:block sticky top-24 self-start space-y-1">
          {rfc.sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block font-mono text-xs text-muted hover:text-accent transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {rfc.sections.map((s) => (
            <section key={s.id}>
              <h2 id={s.id} className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                {s.title}
              </h2>
              <SectionBody body={s.body} />
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
