import CtaButton from "@/components/shared/cta-button";

export default function Hero() {
  return (
    <section className="py-16 md:py-24 text-center">
      <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8">
        <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
        <span className="text-xs text-muted font-[family-name:var(--font-mono)]">Available for new projects</span>
      </div>

      <h1 className="text-3xl md:text-5xl lg:text-[44px] font-bold text-text leading-tight mb-6 font-[family-name:var(--font-display)]">
        I build production systems<br className="hidden md:block" /> that scale.
      </h1>

      <p className="text-base md:text-lg text-muted max-w-[540px] mx-auto mb-8 leading-relaxed">
        Principal Fullstack Developer with 10+ years shipping serverless architecture, AI-driven workflows, and high-scale SaaS. Based in Bangalore.
      </p>

      <div className="flex items-center justify-center gap-3 mb-12">
        <CtaButton href="/services" variant="secondary">Explore Services</CtaButton>
        <CtaButton href="/projects" variant="secondary">View My Work</CtaButton>
      </div>

      <div className="flex items-center justify-center gap-8 pt-8 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-text font-[family-name:var(--font-display)]">10+</div>
          <div className="text-[11px] text-muted uppercase tracking-wider font-[family-name:var(--font-mono)]">Years</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text font-[family-name:var(--font-display)]">50+</div>
          <div className="text-[11px] text-muted uppercase tracking-wider font-[family-name:var(--font-mono)]">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text font-[family-name:var(--font-display)]">Oracle</div>
          <div className="text-[11px] text-muted uppercase tracking-wider font-[family-name:var(--font-mono)]">Certified</div>
        </div>
      </div>
    </section>
  );
}
