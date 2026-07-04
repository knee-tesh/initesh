"use client";

import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./mobile-menu";

const links = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "API Docs", href: "/api-docs" },
  { label: "Book a Call →", href: "/contact" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-void/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-bold">
            <span className="text-mint">$</span>
            <span className="text-text">nitesh</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-accent transition-colors font-[family-name:var(--font-mono)]"
              >
                {link.label}
              </Link>
            ))}
            {/* <Link
              href="/contact"
              className="text-text text-void px-4 py-1.5 rounded text-sm font-semibold font-[family-name:var(--font-mono)] hover:opacity-90 transition-opacity"
            >
              
            </Link> */}
          </div>

          <button
            className="md:hidden text-muted hover:text-text"
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
