import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="border-t border-border">
        <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-2xl text-text font-[family-name:var(--font-display)] leading-none">
            Nitesh<span className="italic text-accent">.</span>
          </span>
          <div className="flex items-center gap-7">
            <Link href="/work" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-text transition-colors font-[family-name:var(--font-mono)]">Work</Link>
            <Link href="/architecture" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-text transition-colors font-[family-name:var(--font-mono)]">Architecture</Link>
            <Link href="/experience" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-text transition-colors font-[family-name:var(--font-mono)]">Experience</Link>
            <Link href="/writing" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-text transition-colors font-[family-name:var(--font-mono)]">Writing</Link>
            <Link href="/about" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-text transition-colors font-[family-name:var(--font-mono)]">About</Link>
            <Link href="/contact" className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-text transition-colors font-[family-name:var(--font-mono)]">Contact</Link>
          </div>
          <div className="text-[11px] text-muted font-[family-name:var(--font-mono)]">
            © {new Date().getFullYear()} Nitesh Tiwari
          </div>
        </div>
      </div>
    </footer>
  );
}