"use client";

import Link from "next/link";
import { useState } from "react";
import Medallion from "@/components/shared/medallion";
import MobileMenu from "./mobile-menu";

const links = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "API Docs", href: "/api-docs" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-linen/80 backdrop-blur-md border-b border-hem">
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Medallion className="w-6 h-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </Medallion>
            <span className="text-xl text-terracotta font-[family-name:var(--font-script)] leading-none pt-1">
              Nitesh
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-wider text-stone hover:text-teal hover:underline underline-offset-4 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-terracotta text-linen px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Book a Call →
            </Link>
          </div>

          <button
            className="md:hidden text-terracotta hover:text-teal"
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
