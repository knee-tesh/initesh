"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/shared/section-heading";
import { RFC_FILTERS, rfcs } from "@/data/rfcs";

export default function ArchitecturePage() {
  const [active, setActive] = useState<string | null>(null);
  const filtered = active ? rfcs.filter((r) => r.category === active) : rfcs;

  return (
    <div className="space-y-12">
      <SectionHeading
        eyebrow="Thinking"
        title="Architecture"
        kicker="How I approach system design, trade-offs, and technical strategy."
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
            active === null
              ? "bg-accent text-inverse border-accent"
              : "border-border text-muted hover:text-text"
          }`}
        >
          All
        </button>
        {RFC_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(active === f ? null : f)}
            className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
              active === f
                ? "bg-accent text-inverse border-accent"
                : "border-border text-muted hover:text-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((rfc) => (
          <Link
            key={rfc.id}
            href={`/architecture/rfcs/${rfc.id}`}
            className="block p-4 border border-border rounded-lg hover:border-accent transition-colors group"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-accent">{rfc.id}</span>
                <h3 className="text-text font-semibold group-hover:text-accent transition-colors">
                  {rfc.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-muted">{rfc.category}</span>
                <br />
                <span className="text-xs text-muted">{rfc.readMinutes} min read</span>
              </div>
            </div>
            <p className="text-xs text-muted mt-1">{rfc.date}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted text-sm">No RFCs in this category yet.</p>
      )}
    </div>
  );
}
