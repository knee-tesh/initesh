"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./mobile-menu";

const links = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "API Docs", href: "/api-docs" },
];

function BrandMark() {
  return (
    <span className="w-2.5 h-2.5 bg-terracotta inline-block mr-2" aria-hidden />
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-void/85 backdrop-blur-md border-b border-hem">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <BrandMark />
            <span className="text-[22px] text-ink font-[family-name:var(--font-display)] leading-none pt-0.5">
              Nitesh<span className="italic text-terracotta">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.16em] text-stone hover:text-ink hover:underline underline-offset-4 transition-colors font-[family-name:var(--font-mono)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="border border-terracotta text-terracotta px-4 py-2 text-[11px] uppercase tracking-[0.16em] font-semibold font-[family-name:var(--font-mono)] hover:bg-terracotta hover:text-paper transition-colors"
            >
              Book a Call →
            </Link>
          </div>

          <button
            className="md:hidden text-ink hover:text-terracotta"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
