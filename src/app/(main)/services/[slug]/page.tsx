import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/shared/breadcrumb";
import services from "@/data/services.json";

export function generateStaticParams() {
  return services.map((s: any) => ({ slug: s.id }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s: any) => s.id === slug);

  if (!service) notFound();

  return (
    <div>
      <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: service.title }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3 font-[family-name:var(--font-display)]">
        {service.title}
      </h1>
      <p className="text-stone leading-relaxed mb-8 max-w-[600px]">
        {service.description}
      </p>

      {service.included && (
        <div className="stitch-card p-6 mb-8">
          <h2 className="text-base font-semibold text-ink mb-4 font-[family-name:var(--font-display)]">
            What&apos;s included:
          </h2>
          <ul className="space-y-3">
            {service.included.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone">
                <span className="text-gold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="stitch-card p-8 text-center">
        <h3 className="text-lg font-semibold text-ink mb-2 font-[family-name:var(--font-display)]">
          Interested in this service?
        </h3>
        <p className="text-sm text-stone mb-6">
          Book a free 15-min discovery call to discuss your needs. Pricing shared during the call.
        </p>
        <Link
          href="/contact"
          className="inline-flex bg-terracotta text-on-accent px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Book Discovery Call →
        </Link>
        <p className="text-xs text-stone mt-3">No commitment · Response within 24 hours</p>
      </div>
    </div>
  );
}
