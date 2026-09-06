import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      <Link
        href="mailto:tiwari.nitesh294@gmail.com?subject=Discovery%20Call%20Request"
        className="stitch-card p-6 text-center hover:border-terracotta transition-colors"
      >
        <div className="text-2xl mb-2">📞</div>
        <div className="text-base font-semibold text-ink font-[family-name:var(--font-display)]">Book a Call</div>
        <div className="text-xs text-stone mt-1 font-[family-name:var(--font-script)]">Free 15-min discovery</div>
      </Link>

      <a
        href="#message-form"
        className="stitch-card p-6 text-center hover:border-teal transition-colors"
      >
        <div className="text-2xl mb-2">💬</div>
        <div className="text-base font-semibold text-ink font-[family-name:var(--font-display)]">Send Message</div>
        <div className="text-xs text-stone mt-1 font-[family-name:var(--font-script)]">Email or form</div>
      </a>
    </div>
  );
}
