import Link from "next/link";
import projects from "@/data/projects.json";

export default function Reel() {
  return (
    <section className="mt-20 md:mt-24">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8 mb-2 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.24em] text-terracotta font-[family-name:var(--font-mono)]">
          Selected Work
        </span>
        <span className="hidden md:block text-[10px] uppercase tracking-[0.16em] text-stone font-[family-name:var(--font-mono)]">
          ← scroll →
        </span>
      </div>

      <div className="mt-4">
        <div
          className="flex gap-4 overflow-x-auto px-4 md:px-[max(1rem,calc((100vw-1240px)/2+2rem))] pb-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group flex-none w-[300px] md:w-[380px] bg-linen border border-hem hover:border-terracotta transition-colors scroll-snap-align:start"
            >
              <div
                className="aspect-[4/3] relative flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(155deg, ${project.brandColor}55 0%, #1b1e24 72%)`,
                }}
              >
                <span className="absolute top-3 left-4 text-[10px] tracking-[0.2em] text-teal font-[family-name:var(--font-mono)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="italic text-2xl md:text-3xl text-teal/90 font-[family-name:var(--font-display)]">
                  {project.title.split(" ")[1] || project.title}
                </span>
              </div>
              <div className="flex items-baseline justify-between px-4 py-3">
                <span className="text-xl font-light text-ink font-[family-name:var(--font-display)]">
                  {project.title}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone font-[family-name:var(--font-mono)]">
                  {project.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}