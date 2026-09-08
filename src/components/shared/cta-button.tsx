import Link from "next/link";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

export default function CtaButton({ href, variant = "primary", children }: CtaButtonProps) {
  const base = "inline-flex items-center gap-2 rounded px-5 py-3 text-sm font-medium transition-colors duration-200";
  const styles = variant === "primary"
    ? "bg-accent text-void hover:bg-accent2"
    : "border border-accent text-accent hover:bg-surface";
  return <Link href={href} className={`${base} ${styles}`}>{children}</Link>;
}
