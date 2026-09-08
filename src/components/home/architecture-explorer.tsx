import Link from "next/link";
import SectionHeading from "@/components/shared/section-heading";

const SYSTEM_NODES = [
  { id: "distributed", label: "Distributed\nSystems", x: 0, y: 1 },
  { id: "cloud", label: "Cloud\nPlatforms", x: 0, y: 2 },
  { id: "devplatforms", label: "Developer\nPlatforms", x: 0, y: 3 },
  { id: "ai", label: "AI &\nAutomation", x: 0, y: 4 },
];

const RESULT_NODES = [
  { id: "reliability", label: "Reliability &\nScalability", x: 1, y: 1.5 },
  { id: "velocity", label: "Developer\nVelocity", x: 1, y: 3.5 },
];

const FLOWS = [
  { from: "distributed", to: "reliability" },
  { from: "cloud", to: "reliability" },
  { from: "cloud", to: "velocity" },
  { from: "devplatforms", to: "velocity" },
  { from: "ai", to: "velocity" },
  { from: "ai", to: "reliability" },
];

const nodeX = (x: number) => (x === 0 ? 40 : 300);
const nodeY = (y: number) => 30 + (y - 1) * 90;
const nodeW = 120;
const nodeH = 52;

function nodeCenter(id: string) {
  const all = [...SYSTEM_NODES, ...RESULT_NODES];
  const n = all.find((n) => n.id === id)!;
  return { x: nodeX(n.x) + nodeW / 2, y: nodeY(n.y) + nodeH / 2 };
}

export default function ArchitectureExplorer() {
  const midY = 30 + 3 * 90 + (nodeH - 4) / 2;

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading
          eyebrow="Architecture"
          title="Systems at a Glance"
          kicker="How core technical disciplines converge into reliable, scalable outcomes."
        />
        <div className="mt-12 overflow-x-auto">
          <svg
            viewBox="0 0 440 430"
            className="w-full max-w-lg mx-auto"
            role="img"
            aria-label="Architecture overview showing distributed systems, cloud platforms, developer platforms, and AI & automation flowing into reliability & scalability and developer velocity"
          >
            <title>Architecture Overview</title>
            <desc>A simplified map of technical domains converging into two outcome areas.</desc>

            {FLOWS.map((f) => {
              const from = nodeCenter(f.from);
              const to = nodeCenter(f.to);
              const mid = (from.x + to.x) / 2;
              return (
                <path
                  key={`${f.from}-${f.to}`}
                  d={`M${from.x},${from.y} C${mid},${from.y} ${mid},${to.y} ${to.x},${to.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-border opacity-40 group-hover:opacity-60 transition-opacity"
                />
              );
            })}

            {SYSTEM_NODES.map((n) => (
              <g key={n.id} className="group cursor-default">
                <rect
                  x={nodeX(n.x)}
                  y={nodeY(n.y)}
                  width={nodeW}
                  height={nodeH}
                  rx="6"
                  className="fill-surface stroke-border stroke-1 group-hover:stroke-accent transition-colors"
                />
                <text
                  x={nodeX(n.x) + nodeW / 2}
                  y={nodeY(n.y) + nodeH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-text text-xs font-mono"
                >
                  {n.label.split("\n").map((line, i) => (
                    <tspan key={i} x={nodeX(n.x) + nodeW / 2} dy={i === 0 ? `-${0.35}em` : "1.1em"}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <title>{n.label.replace("\n", " ")}</title>
              </g>
            ))}

            {RESULT_NODES.map((n) => (
              <g key={n.id} className="group cursor-default">
                <rect
                  x={nodeX(n.x)}
                  y={nodeY(n.y)}
                  width={nodeW}
                  height={nodeH}
                  rx="6"
                  className="fill-surface stroke-accent stroke-1.5 group-hover:fill-accent/10 transition-colors"
                />
                <text
                  x={nodeX(n.x) + nodeW / 2}
                  y={nodeY(n.y) + nodeH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-text text-xs font-semibold"
                >
                  {n.label.split("\n").map((line, i) => (
                    <tspan key={i} x={nodeX(n.x) + nodeW / 2} dy={i === 0 ? `-${0.35}em` : "1.1em"}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <title>{n.label.replace("\n", " ")}</title>
              </g>
            ))}
          </svg>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/architecture"
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent2 transition-colors"
          >
            Explore the architecture &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
