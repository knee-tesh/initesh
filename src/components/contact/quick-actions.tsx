import Link from "next/link";

function PhoneIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function QuickActions() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      <Link
        href="mailto:tiwari.nitesh294@gmail.com?subject=Discovery%20Call%20Request"
        className="stitch-card p-6 text-center hover:border-terracotta transition-colors cursor-pointer"
      >
        <div className="flex justify-center mb-2"><PhoneIcon /></div>
        <div className="text-base font-semibold text-ink font-[family-name:var(--font-display)]">Book a Call</div>
        <div className="text-xs text-stone mt-1 font-[family-name:var(--font-script)]">Free 15-min discovery</div>
      </Link>

      <a
        href="#message-form"
        className="stitch-card p-6 text-center hover:border-teal transition-colors cursor-pointer"
      >
        <div className="flex justify-center mb-2"><MessageIcon /></div>
        <div className="text-base font-semibold text-ink font-[family-name:var(--font-display)]">Send Message</div>
        <div className="text-xs text-stone mt-1 font-[family-name:var(--font-script)]">Email or form</div>
      </a>
    </div>
  );
}
