'use client';

import CtaButton from "@/components/shared/cta-button";
import { useInView } from "@/lib/use-in-view";
import { useCountUp } from "@/lib/use-count-up";

const stats: Array<{ label: string } & ({ target: number } | { text: string })> = [
  { target: 10, label: "Years" },
  { target: 50, label: "Projects" },
  { text: "Oracle", label: "Certified" },
];

export default function Hero() {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true });
  const years = useCountUp(10, { active: inView });
  const projects = useCountUp(50, { active: inView });

  return (
    <section className="relative py-16 md:py-24 max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-10">
        <span className="w-2.5 h-2.5 bg-terracotta inline-block" aria-hidden />
        <span className="text-[11px] uppercase tracking-[0.24em] text-terracotta font-[family-name:var(--font-mono)]">
          Portfolio — Principal Fullstack, Bangalore
        </span>
      </div>

      <h1 className="max-w-[11ch] text-[clamp(52px,8vw,120px)] leading-[0.98] text-ink font-[family-name:var(--font-display)] font-light tracking-tight">
        I build production systems that{" "}
        <em className="italic font-normal text-terracotta">scale</em>{" "}
        quietly.
      </h1>

      <div className="mt-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-hem pt-6">
        <p className="max-w-sm text-sm text-stone leading-relaxed">
          10+ years shipping serverless architecture, AI-driven workflows,
          and high-scale SaaS from Bangalore, India.
        </p>
        <span className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-teal font-[family-name:var(--font-mono)]">
          <span className="relative flex h-2 w-2">
            <span className="pulse-clay absolute inline-flex h-full w-full rounded-full bg-terracotta" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta" />
          </span>
          open to new work
        </span>
      </div>

      <div className="flex items-center justify-between gap-10 mt-10" ref={ref}>
        <div className="flex items-center gap-8">
          <CtaButton href="/services" variant="primary">Explore Services</CtaButton>
          <CtaButton href="/projects" variant="secondary">View My Work</CtaButton>
        </div>
        <div className="hidden md:flex items-center gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-right">
              <div className="text-3xl font-light text-teal font-[family-name:var(--font-display)]">
                {"target" in stat ? `${stat.target === 10 ? years : projects}+` : stat.text}
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-stone font-[family-name:var(--font-mono)] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}