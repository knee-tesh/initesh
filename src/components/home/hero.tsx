import CtaButton from "@/components/shared/cta-button";
import Garland from "@/components/shared/garland";
import Medallion from "@/components/shared/medallion";

const stats = [
  { value: "10+", label: "Years" },
  { value: "50+", label: "Projects" },
  { value: "Oracle", label: "Certified" },
];

export default function Hero() {
  return (
    <section className="py-14 md:py-20 text-center relative">
      <div className="absolute inset-x-0 top-0 flex justify-center">
        <Garland />
      </div>

      <div className="inline-flex items-center gap-2 bg-blush border border-hem rounded-full px-4 py-1 -rotate-2 mt-14 mb-8">
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="text-sm text-terracotta font-[family-name:var(--font-script)]">open to new work</span>
      </div>

      <p className="text-2xl text-teal font-[family-name:var(--font-script)] mb-1">Namaste,</p>
      <h1 className="text-3xl md:text-5xl text-ink font-[family-name:var(--font-display)] font-bold leading-tight mb-6">
        I build production systems<br className="hidden md:block" /> that scale.
      </h1>

      <p className="text-base md:text-lg text-stone max-w-[540px] mx-auto mb-8 leading-relaxed">
        Principal Fullstack Developer with 10+ years shipping serverless architecture, AI-driven workflows, and high-scale SaaS. Based in Bangalore.
      </p>

      <div className="flex items-center justify-center gap-3 mb-12">
        <CtaButton href="/services" variant="primary">Explore Services</CtaButton>
        <CtaButton href="/projects" variant="secondary">View My Work</CtaButton>
      </div>

      <div className="flex items-center justify-center gap-4 pt-8 border-t border-hem">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-terracotta font-[family-name:var(--font-display)]">
                {stat.value}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-stone font-[family-name:var(--font-script)]">
                {stat.label}
              </div>
            </div>
            {stat !== stats[stats.length - 1] && <Medallion className="w-4 h-4 text-gold" />}
          </div>
        ))}
      </div>
    </section>
  );
}
