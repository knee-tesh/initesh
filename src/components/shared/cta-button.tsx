import Link from "next/link";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

export default function CtaButton({ href, variant = "primary", children }: CtaButtonProps) {
  const base = "inline-flex items-center justify-center px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-colors font-[family-name:var(--font-mono)]";
  const styles = {
    primary: "bg-terracotta text-on-accent hover:bg-teal",
    secondary: "border border-hem text-ink hover:border-terracotta hover:text-terracotta",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
