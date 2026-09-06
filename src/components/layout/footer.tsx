import Link from "next/link";
import WovenBand from "@/components/shared/woven-band";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="pt-8 border-t border-hem">
        <WovenBand />
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 pb-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xl text-terracotta font-[family-name:var(--font-script)] leading-none pt-1">
              Nitesh
            </span>
            <div className="flex items-center gap-6 text-sm text-stone">
              <Link href="/services" className="hover:text-teal transition-colors">Services</Link>
              <Link href="/about" className="hover:text-teal transition-colors">About</Link>
              <Link href="/contact" className="hover:text-teal transition-colors">Contact</Link>
            </div>
            <div className="text-xs text-stone">
              © {new Date().getFullYear()} Nitesh Tiwari
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
