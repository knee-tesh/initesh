"use client";

import { useEffect, useState } from "react";
import projects from "@/data/projects.json";

export default function Ledger() {
  const total = projects.length;
  const [rows, setRows] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const delay = mq.matches ? 0 : 220;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setRows(i);
      if (i >= total) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="my-16">
      <div className="max-w-[560px] mx-auto bg-linen rounded-lg p-6 border border-hem shadow-sm">
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-2xl text-terracotta font-[family-name:var(--font-script)]">recent work</span>
          <span className="text-sm text-stone font-[family-name:var(--font-script)]">{total} entries</span>
        </div>
        <ul className="space-y-0">
          {projects.slice(0, rows).map((project) => (
            <li
              key={project.id}
              className="flex items-baseline justify-between gap-4 py-2.5 border-b border-dashed border-hem"
              style={{ animation: "fadeIn 0.4s ease" }}
            >
              <span className="text-lg text-ink font-[family-name:var(--font-script)]">{project.title}</span>
              <span className="text-sm text-stone font-[family-name:var(--font-script)]">{project.category}</span>
            </li>
          ))}
        </ul>
        {rows < total && (
          <div className="text-2xl text-terracotta font-[family-name:var(--font-script)] pt-2">✎</div>
        )}
      </div>
      <p className="text-center text-xs text-stone mt-3 font-[family-name:var(--font-script)]">
        every tale has a thread — here&apos;s some of mine
      </p>
    </section>
  );
}