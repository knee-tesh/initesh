import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-stone mb-6">
      <Link href="/" className="hover:text-teal transition-colors">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-gold">›</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-teal transition-colors">{item.label}</Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
