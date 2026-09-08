import Link from "next/link";

export default function ServicesTeaser() {
  return (
    <section className="mt-20 md:mt-24 max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/services?audience=founders"
          className="group block bg-linen border border-hem p-6 md:p-8 hover:border-terracotta transition-colors"
        >
          <span className="text-[10px] tracking-[0.24em] text-gold font-[family-name:var(--font-mono)]">
            01
          </span>
          <h3 className="mt-4 text-2xl font-light text-ink font-[family-name:var(--font-display)]">
            For Founders &amp; CTOs
          </h3>
          <p className="mt-2 text-sm text-stone leading-relaxed">
            Ship faster with senior-level architecture, code audits, and hands-on feature delivery.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.16em] text-terracotta font-[family-name:var(--font-mono)] group-hover:underline underline-offset-4">
            View services →
          </span>
        </Link>

        <Link
          href="/services?audience=developers"
          className="group block bg-linen border border-hem p-6 md:p-8 hover:border-terracotta transition-colors"
        >
          <span className="text-[10px] tracking-[0.24em] text-gold font-[family-name:var(--font-mono)]">
            02
          </span>
          <h3 className="mt-4 text-2xl font-light text-ink font-[family-name:var(--font-display)]">
            For Developers
          </h3>
          <p className="mt-2 text-sm text-stone leading-relaxed">
            Level up with AI training, interview coaching, portfolio reviews, and 1:1 mentoring.
          </p>
          <span className="mt-5 inline-block text-[11px] uppercase tracking-[0.16em] text-terracotta font-[family-name:var(--font-mono)] group-hover:underline underline-offset-4">
            View services →
          </span>
        </Link>
      </div>
    </section>
  );
}