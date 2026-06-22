import Link from "next/link";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

export default function CtaButton({ href, variant = "primary", children }: CtaButtonProps) {
  const base = "inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold transition-colors font-[family-name:var(--font-mono)]";
  const styles = {
    primary: "bg-accent text-void hover:opacity-90",
    secondary: "border border-border text-text hover:border-accent hover:text-accent",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
