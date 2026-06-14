import ProcessCard from "@/components/process-card";
import rawSkills from "@/data/skills.json";
import type { Skill, SkillCategory } from "@/lib/types";

const skills = rawSkills as Skill[];

const categoryColors: Record<SkillCategory, string> = {
  frontend: "#58a6ff",
  backend: "#3fb950",
  infrastructure: "#d29922",
  databases: "#c975e0",
  tools: "#f78166",
  leadership: "#ff7b72",
};

export default function SkillsPage() {
  const grouped = skills.reduce<Record<string, Skill[]>>(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold" style={{ color: "var(--fg)" }}>
          skills.service (PID 1)
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Technical skills and expertise matrix. Use category filters below.
        </p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2
            className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2"
            style={{ color: categoryColors[category as SkillCategory] ?? "var(--accent)" }}
          >
            <span aria-hidden="true">▸</span>
            {category}
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              ({items.length})
            </span>
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((skill) => (
              <div
                key={skill.name}
                className="process-card p-3 rounded-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                    {skill.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {skill.years}y
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm"
                    style={{
                      backgroundColor: (categoryColors[skill.category as SkillCategory] ?? "var(--accent)") + "20",
                      color: categoryColors[skill.category as SkillCategory] ?? "var(--accent)",
                    }}
                  >
                    {skill.depth}
                  </span>
                  {skill.note && (
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {skill.note}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
