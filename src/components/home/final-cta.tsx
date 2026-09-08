import CtaButton from "@/components/shared/cta-button";

export default function FinalCta() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-text">
          Have a difficult systems problem?
        </h2>
        <p className="mt-4 text-xl text-muted">Let&apos;s talk.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <CtaButton href="/contact" variant="primary">Contact</CtaButton>
          <CtaButton href="/resume" variant="secondary">Download r&eacute;sum&eacute;</CtaButton>
        </div>
      </div>
    </section>
  );
}
