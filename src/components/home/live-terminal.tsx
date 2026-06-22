"use client";

import { useEffect, useState } from "react";
import TerminalWindow from "@/components/shared/terminal-window";
import projects from "@/data/projects.json";

export default function LiveTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const projectLines = projects.map(
      (p) => `│ ${p.title.padEnd(16)} ${p.category.padEnd(14)} ● live │`
    );

    const allLines = [
      `$ recent-work --list`,
      `╭──────────────────────────────────────────────╮`,
      ...projectLines,
      `╰──────────────────────────────────────────────╯`,
      `$ _`,
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < allLines.length) {
        setLines((prev) => [...prev, allLines[i]]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursor = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(cursor);
  }, []);

  return (
    <section className="my-12">
      <TerminalWindow>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="text-text whitespace-pre">
              {i === 0 && <span className="text-mint">$ </span>}
              {i === 0 ? line.replace("$ ", "") : line}
            </div>
          ))}
          {lines.length === projects.length + 4 && (
            <div className="text-text">
              <span className="text-mint">$ </span>
              <span className={showCursor ? "border-r-2 border-text" : "border-r-2 border-transparent"}>&nbsp;</span>
            </div>
          )}
        </div>
      </TerminalWindow>
    </section>
  );
}
