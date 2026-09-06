import ServiceCard from "./service-card";
import services from "@/data/services.json";

export default function AudienceSplit({ audience }: { audience?: string }) {
  const founders = services.filter((s: any) => s.audience === "founders");
  const developers = services.filter((s: any) => s.audience === "developers");

  const showFounders = !audience || audience === "founders";
  const showDevelopers = !audience || audience === "developers";

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {showFounders && (
        <div>
          <h2 className="text-xs uppercase tracking-[2px] text-terracotta mb-4 font-[family-name:var(--font-script)]">
            For Founders & CTOs
          </h2>
          <p className="text-sm text-stone mb-6">Ship faster with senior-level expertise.</p>
          <div className="space-y-4">
            {founders.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {showDevelopers && (
        <div>
          <h2 className="text-xs uppercase tracking-[2px] text-teal mb-4 font-[family-name:var(--font-script)]">
            For Developers
          </h2>
          <p className="text-sm text-stone mb-6">Level up your career and skills.</p>
          <div className="space-y-4">
            {developers.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
