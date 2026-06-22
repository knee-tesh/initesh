import Link from "next/link";

export default function ServicesTeaser() {
  return (
    <section className="my-16">
      <h2 className="text-xs uppercase tracking-[2px] text-muted text-center mb-8 font-[family-name:var(--font-mono)]">
        How I Can Help
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/services?audience=founders"
          className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors group"
        >
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="text-lg font-semibold text-text mb-2 font-[family-name:var(--font-display)]">
            For Founders & CTOs
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Ship faster with senior-level architecture, code audits, and hands-on feature delivery.
          </p>
          <div className="mt-4 text-sm text-accent font-[family-name:var(--font-mono)] group-hover:underline">
            View services →
          </div>
        </Link>

        <Link
          href="/services?audience=developers"
          className="bg-surface border border-border rounded-lg p-6 hover:border-lavender transition-colors group"
        >
          <div className="text-2xl mb-3">🚀</div>
          <h3 className="text-lg font-semibold text-text mb-2 font-[family-name:var(--font-display)]">
            For Developers
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Level up with AI training, interview coaching, portfolio reviews, and 1:1 mentoring.
          </p>
          <div className="mt-4 text-sm text-lavender font-[family-name:var(--font-mono)] group-hover:underline">
            View services →
          </div>
        </Link>
      </div>
    </section>
  );
}
