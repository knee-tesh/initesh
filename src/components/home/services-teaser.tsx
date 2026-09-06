import Link from "next/link";
import Medallion from "@/components/shared/medallion";

export default function ServicesTeaser() {
  return (
    <section className="my-16">
      <h2 className="text-xs uppercase tracking-[2px] text-stone text-center mb-8 font-[family-name:var(--font-script)]">
        How I Help
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/services?audience=founders"
          className="stitch-card p-6 hover:border-terracotta transition-colors group block"
        >
          <Medallion className="w-9 h-9 mb-3 text-terracotta mr-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L5 13h5l-1 9 8-11h-5l1-9z" fill="currentColor" />
            </svg>
          </Medallion>
          <h3 className="text-lg font-semibold text-ink mb-2 font-[family-name:var(--font-display)]">
            For Founders & CTOs
          </h3>
          <p className="text-sm text-stone leading-relaxed">
            Ship faster with senior-level architecture, code audits, and hands-on feature delivery.
          </p>
          <div className="mt-4 text-sm text-teal group-hover:underline">View services →</div>
        </Link>

        <Link
          href="/services?audience=developers"
          className="stitch-card p-6 hover:border-teal transition-colors group block"
        >
          <Medallion className="w-9 h-9 mb-3 text-teal mr-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l6-6-6-6M12 19h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Medallion>
          <h3 className="text-lg font-semibold text-ink mb-2 font-[family-name:var(--font-display)]">
            For Developers
          </h3>
          <p className="text-sm text-stone leading-relaxed">
            Level up with AI training, interview coaching, portfolio reviews, and 1:1 mentoring.
          </p>
          <div className="mt-4 text-sm text-teal group-hover:underline">View services →</div>
        </Link>
      </div>
    </section>
  );
}