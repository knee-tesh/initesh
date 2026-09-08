export default function SectionHeading({
  eyebrow,
  title,
  kicker,
}: {
  eyebrow?: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-text">
        {title}
      </h2>
      {kicker && <p className="mt-4 text-muted text-lg leading-relaxed">{kicker}</p>}
    </div>
  );
}
