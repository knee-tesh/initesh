import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      <Link
        href="mailto:tiwari.nitesh294@gmail.com?subject=Discovery%20Call%20Request"
        className="bg-surface border border-border rounded-lg p-6 text-center hover:border-accent transition-colors"
      >
        <div className="text-2xl mb-2">📞</div>
        <div className="text-base font-semibold text-text font-[family-name:var(--font-display)]">Book a Call</div>
        <div className="text-xs text-muted mt-1 font-[family-name:var(--font-mono)]">Free 15-min discovery</div>
      </Link>

      <a
        href="#message-form"
        className="bg-surface border border-border rounded-lg p-6 text-center hover:border-mint transition-colors"
      >
        <div className="text-2xl mb-2">💬</div>
        <div className="text-base font-semibold text-text font-[family-name:var(--font-display)]">Send Message</div>
        <div className="text-xs text-muted mt-1 font-[family-name:var(--font-mono)]">Email or form</div>
      </a>
    </div>
  );
}
