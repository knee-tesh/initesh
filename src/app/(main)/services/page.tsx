import AudienceSplit from "@/components/services/audience-split";

export default function ServicesPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-2 font-[family-name:var(--font-display)]">
        Services
      </h1>
      <p className="text-muted mb-8">
        Select a service to learn more. Pricing shared during discovery call.
      </p>
      <AudienceSplit />
    </div>
  );
}
