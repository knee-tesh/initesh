"use client";
import CtaButton from "@/components/shared/cta-button";

export default function Hero() {
  return (
    <section className="max-w-[900px] pt-24 pb-16 md:pt-32 md:pb-24">
      <p className="font-mono text-sm text-accent mb-4">NITESH TIWARI</p>
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text leading-[1.05]">
        PRINCIPAL SOFTWARE ENGINEER
      </h1>
      <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
        Designing resilient distributed systems and platforms that scale across customers, teams and business demands.
      </p>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
        10+ YEARS · DISTRIBUTED SYSTEMS · CLOUD · LEADERSHIP
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <CtaButton href="#work">View Selected Work</CtaButton>
        <CtaButton href="/writing" variant="secondary">Engineering Writing</CtaButton>
      </div>
    </section>
  );
}
