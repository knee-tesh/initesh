import about from "@/data/about.json";

export default function Philosophy() {
  return (
    <section className="stitch-card p-6">
      <h2 className="text-xs uppercase tracking-[2px] text-terracotta mb-4 font-[family-name:var(--font-script)]">
        Philosophy
      </h2>
      <ul className="space-y-3">
        {about.philosophy.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-stone">
            <span className="text-gold mt-0.5">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
