import Link from "next/link";

type CtaButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
};

export default function CtaButton({ href, variant = "primary", children }: CtaButtonProps) {
  const base = "inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold transition-colors";
  const styles = {
    primary: "bg-terracotta text-linen hover:opacity-90",
    secondary: "border-2 border-teal text-teal hover:bg-blush/50",
  };

  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
