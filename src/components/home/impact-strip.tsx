// TODO(content): All metrics below must be verified against the truth layer before publish.
export default function ImpactStrip() {
  const metrics = [
    { value: "10M+", label: "Events/day" },
    { value: "99.99%", label: "Availability" },
    { value: "<100ms", label: "Latency" },
    { value: "35%", label: "Cost impact" },
  ];
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
      {metrics.map((m) => (
        <div key={m.label} className="bg-surface p-6">
          <p className="font-mono text-3xl text-accent">{m.value}</p>
          <p className="mt-1 text-sm text-muted">{m.label}</p>
        </div>
      ))}
    </section>
  );
}
