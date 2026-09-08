"use client";

import { useState } from "react";

interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  detail: { responsibility: string; why: string; tradeoff: string };
  kind: "system" | "result";
}

interface DiagramEdge {
  from: string;
  to: string;
}

const NODES: DiagramNode[] = [
  {
    id: "distributed", label: "Distributed\nSystems", x: 0, y: 1, kind: "system",
    detail: {
      responsibility: "Design and operate systems that span multiple machines and failure domains.",
      why: "Scale and resilience require distribution — single nodes hit hard limits.",
      tradeoff: "Operational complexity grows non-linearly with node count.",
    },
  },
  {
    id: "cloud", label: "Cloud\nPlatforms", x: 0, y: 2, kind: "system",
    detail: {
      responsibility: "Leverage cloud-native primitives (compute, storage, networking) to ship faster.",
      why: "Cloud providers eliminate undifferentiated heavy lifting around infrastructure.",
      tradeoff: "Vendor lock-in and cost unpredictability at scale.",
    },
  },
  {
    id: "devplatforms", label: "Developer\nPlatforms", x: 0, y: 3, kind: "system",
    detail: {
      responsibility: "Build internal platforms that accelerate development and deployment workflows.",
      why: "Consistent tooling reduces cognitive load and lets engineers ship independently.",
      tradeoff: "Platform teams are a long-term investment that slow feature teams initially.",
    },
  },
  {
    id: "ai", label: "AI &\nAutomation", x: 0, y: 4, kind: "system",
    detail: {
      responsibility: "Integrate AI and automation into operational and development processes.",
      why: "Repetitive cognitive work (incident triage, code review, monitoring) should be augmented.",
      tradeoff: "AI outputs are probabilistic — guardrails and human oversight are non-negotiable.",
    },
  },
  {
    id: "reliability", label: "Reliability &\nScalability", x: 1, y: 1.5, kind: "result",
    detail: {
      responsibility: "Ensure systems meet availability SLOs while scaling with demand.",
      why: "User trust and business outcomes depend on predictable system behavior.",
      tradeoff: "Higher reliability requires more investment in redundancy, testing, and monitoring.",
    },
  },
  {
    id: "velocity", label: "Developer\nVelocity", x: 1, y: 3.5, kind: "result",
    detail: {
      responsibility: "Maximize the rate at which teams can safely ship changes to production.",
      why: "Faster feedback loops compound — small improvements in velocity multiply over time.",
      tradeoff: "Speed without guardrails creates tech debt; guardrails without automation kill speed.",
    },
  },
];

const EDGES: DiagramEdge[] = [
  { from: "distributed", to: "reliability" },
  { from: "cloud", to: "reliability" },
  { from: "cloud", to: "velocity" },
  { from: "devplatforms", to: "velocity" },
  { from: "ai", to: "velocity" },
  { from: "ai", to: "reliability" },
];

const NODE_W = 120;
const NODE_H = 52;
const nodeX = (x: number) => (x === 0 ? 40 : 300);
const nodeY = (y: number) => 30 + (y - 1) * 90;

function center(id: string) {
  const n = NODES.find((n) => n.id === id)!;
  return { x: nodeX(n.x) + NODE_W / 2, y: nodeY(n.y) + NODE_H / 2 };
}

export default function ArchitectureDiagram() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = NODES.find((n) => n.id === selected);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 440 430"
          className="w-full max-w-lg mx-auto"
          role="img"
          aria-label="Architecture diagram showing system domains converging into reliability, scalability, and developer velocity outcomes"
        >
          <title>Architecture Diagram</title>
          <desc>Interactive node-and-flow diagram of technical domains and their outcomes.</desc>

          {EDGES.map((e) => {
            const from = center(e.from);
            const to = center(e.to);
            const mid = (from.x + to.x) / 2;
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={`M${from.x},${from.y} C${mid},${from.y} ${mid},${to.y} ${to.x},${to.y}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-border opacity-40"
              />
            );
          })}

          {NODES.map((n) => {
            const isSelected = n.id === selected;
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={n.label.replace("\n", " ")}
                className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-accent2"
                onClick={() => setSelected(isSelected ? null : n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(isSelected ? null : n.id);
                  }
                }}
              >
                <rect
                  x={nodeX(n.x)}
                  y={nodeY(n.y)}
                  width={NODE_W}
                  height={NODE_H}
                  rx="6"
                  className={
                    n.kind === "result"
                      ? `fill-surface stroke-accent stroke-1.5 ${isSelected ? "fill-accent/10" : ""}`
                      : `fill-surface stroke-border stroke-1 ${isSelected ? "stroke-accent" : ""}`
                  }
                />
                <text
                  x={nodeX(n.x) + NODE_W / 2}
                  y={nodeY(n.y) + NODE_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`fill-text text-xs font-mono pointer-events-none ${n.kind === "result" ? "font-semibold" : ""}`}
                >
                  {n.label.split("\n").map((line, i) => (
                    <tspan key={i} x={nodeX(n.x) + NODE_W / 2} dy={i === 0 ? "-0.35em" : "1.1em"}>
                      {line}
                    </tspan>
                  ))}
                </text>
                <title>{n.label.replace("\n", " ")}</title>
                <desc>{n.detail.responsibility}</desc>
              </g>
            );
          })}
        </svg>
      </div>

      {sel && (
        <div className="mt-6 p-4 border border-border rounded-lg bg-surface/50">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-2">
            {sel.label.replace("\n", " ")}
          </h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-text">Responsibility</dt>
              <dd className="text-muted">{sel.detail.responsibility}</dd>
            </div>
            <div>
              <dt className="font-semibold text-text">Why</dt>
              <dd className="text-muted">{sel.detail.why}</dd>
            </div>
            <div>
              <dt className="font-semibold text-text">Trade-off</dt>
              <dd className="text-muted">{sel.detail.tradeoff}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
