import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm">
            <span className="text-mint">$</span>
            <span className="text-muted">nitesh</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted font-[family-name:var(--font-mono)]">
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>

          <div className="text-xs text-muted">
            © {new Date().getFullYear()} Nitesh Tiwari
          </div>
        </div>
      </div>
    </footer>
  );
}
