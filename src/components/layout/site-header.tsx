"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MobileMenu from "@/components/layout/mobile-menu";

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/architecture", label: "Architecture" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
];

export default function SiteHeader({ onPalette }: { onPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${scrolled ? "bg-void/90 backdrop-blur border-border" : "bg-transparent border-transparent"}`}>
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-semibold tracking-widest text-text">NITESH</Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-text">{n.label}</Link>
          ))}
          <span className="text-border">·</span>
          <Link href="/about" className="hover:text-text">About</Link>
          <Link href="/contact" className="hover:text-text">Contact</Link>
          <button onClick={onPalette} className="font-mono text-xs text-muted border border-border rounded px-2 py-0.5 hover:text-text" aria-label="Open command palette">⌘K</button>
        </nav>
        <button className="md:hidden text-text" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
