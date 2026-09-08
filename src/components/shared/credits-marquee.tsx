const items = [
  "serverless",
  "AI workflows",
  "high-scale SaaS",
  "architecture",
  "Bangalore",
  "production",
  "resilience",
  "delivery",
];

export default function CreditsMarquee() {
  const strip = [...items, ...items];
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-hem py-5 mt-20 whitespace-nowrap relative"
    >
      <div className="marquee-track inline-flex items-center">
        {strip.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="italic text-2xl md:text-3xl font-light text-stone font-[family-name:var(--font-display)]">
              {item}
            </span>
            <span className="mx-6 text-terracotta text-xs font-[family-name:var(--font-mono)]">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}