"use client";

import Link from "next/link";

const links = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "API Docs", href: "/api-docs" },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center gap-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-stone hover:text-terracotta"
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="text-2xl text-ink hover:text-terracotta transition-colors font-[family-name:var(--font-display)]"
        >
          {link.label}
        </Link>
      ))}

      <Link
        href="/contact"
        onClick={onClose}
        className="bg-terracotta text-paper px-6 py-3 text-base uppercase tracking-[0.14em] font-semibold font-[family-name:var(--font-mono)]"
      >
        Book a Call →
      </Link>
    </div>
  );
}
