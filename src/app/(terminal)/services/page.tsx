import ProcessCard from "@/components/process-card";
import rawServices from "@/data/services.json";
import type { Service, ServiceTier } from "@/lib/types";

const services = rawServices as Service[];

const tierStyles: Record<ServiceTier, { color: string; label: string }> = {
  audit: { color: "#58a6ff", label: "AUDIT" },
  advisory: { color: "#3fb950", label: "ADVISORY" },
  execution: { color: "#d29922", label: "EXECUTION" },
  interim: { color: "#f78166", label: "INTERIM" },
};

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>
          services.daemon (PID 2)
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Consulting services and engagement models. Select a tier to learn more.
        </p>
      </div>

      <div className="grid gap-4">
        {services.map((service: Service) => {
          const tier = tierStyles[service.tier as ServiceTier];
          return (
            <ProcessCard
              key={service.id}
              process={{
                pid: service.tier === "audit" ? 2 : service.tier === "advisory" ? 3 : service.tier === "execution" ? 4 : 5,
                name: service.title,
                href: `/contact?service=${service.id}`,
                status: "running",
              }}
            >
              <p className="mb-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {service.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span
                  className="px-1.5 py-0.5 rounded-sm font-medium"
                  style={{
                    backgroundColor: tier.color + "20",
                    color: tier.color,
                  }}
                >
                  {tier.label}
                </span>
                <span style={{ color: "var(--muted)" }}>
                  {service.priceRange}
                </span>
                <span style={{ color: "var(--muted)" }}>
                  {service.delivery}
                </span>
              </div>
            </ProcessCard>
          );
        })}
      </div>
    </div>
  );
}
