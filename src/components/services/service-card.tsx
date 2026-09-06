import Link from "next/link";
import Tag from "@/components/shared/tag";

const tierColors: Record<string, string> = {
  audit: "#6c9cfc",
  advisory: "#4ade80",
  execution: "#fb923c",
  interim: "#ef4444",
  learning: "#c084fc",
};

export default function ServiceCard({ service }: { service: any }) {
  const color = tierColors[service.tier] || "var(--color-accent)";

  return (
    <Link
      href={`/services/${service.id}`}
      className="stitch-card p-5 hover:border-teal transition-colors group block"
    >
      <h3 className="text-base font-semibold text-ink mb-2 font-[family-name:var(--font-display)]">
        {service.title}
      </h3>
      <p className="text-sm text-stone leading-relaxed mb-3">
        {service.description}
      </p>
      <div className="flex items-center justify-between">
        <Tag label={service.tier.toUpperCase()} color={color} />
        <span className="text-sm text-teal group-hover:underline">
          Learn more →
        </span>
      </div>
    </Link>
  );
}
