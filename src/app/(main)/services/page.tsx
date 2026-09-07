import AudienceSplit from "@/components/services/audience-split";
import Reveal from "@/components/shared/reveal";

export default function ServicesPage() {
  return (
    <div>
      <Reveal>
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2 font-[family-name:var(--font-display)]">
          Services
        </h1>
        <p className="text-stone mb-8">
          Select a service to learn more. Pricing shared during discovery call.
        </p>
      </Reveal>
      <Reveal className="w-full">
        <AudienceSplit />
      </Reveal>
    </div>
  );
}
