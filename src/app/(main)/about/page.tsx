import Timeline from "@/components/about/timeline";
import Philosophy from "@/components/about/philosophy";
import about from "@/data/about.json";

export default function AboutPage() {
  return (
    <div className="max-w-[640px]">
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-6 font-[family-name:var(--font-display)]">
        About
      </h1>

      <div className="space-y-4 mb-10">
        {about.narrative.map((paragraph, i) => (
          <p key={i} className="text-base text-muted leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mb-10">
        <Timeline />
      </div>

      <Philosophy />
    </div>
  );
}
