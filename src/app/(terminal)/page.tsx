import { headers } from "next/headers";
import Link from "next/link";
import ProcessCard from "@/components/process-card";

const processes = [
  { pid: 1, name: "skills.service", href: "/skills", status: "running" as const },
  { pid: 2, name: "services.daemon", href: "/services", status: "running" as const },
  { pid: 3, name: "about.d", href: "/about", status: "idle" as const },
  { pid: 4, name: "contact.sock", href: "/contact", status: "running" as const },
];

export default async function HomePage() {
  const h = await headers();
  const palette = h.get("x-palette") ?? "dawn";

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: "var(--fg)" }}>
          Principal Fullstack Developer
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          I design and build production systems at scale — from serverless architecture to AI-driven workflows.
          <br />
          Nearly 10 years of shipping. Currently at Principal level.
        </p>
        <p className="text-xs" style={{ color: "var(--accent)" }} suppressHydrationWarning>
          System initialized. Palette: {palette.toUpperCase()}. Ready for input.
        </p>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
          Running Processes
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {processes.map((p) => (
            <ProcessCard key={p.pid} process={p}>
              <span>
                {p.pid === 1 && "View technical skills and expertise matrix"}
                {p.pid === 2 && "Explore consulting services and engagement models"}
                {p.pid === 3 && "Read my story, philosophy, and career timeline"}
                {p.pid === 4 && "Get in touch — email, calendar, and links"}
              </span>
            </ProcessCard>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs" style={{ color: "var(--muted)" }}>
        <span suppressHydrationWarning>
          Press <kbd className="px-1 border rounded" style={{ borderColor: "var(--border)", color: "var(--fg)" }}>⌘K</kbd> for commands
        </span>
        <span className="mx-2">·</span>
        <Link href="/contact" className="underline hover:no-underline" style={{ color: "var(--accent)" }}>
          Contact
        </Link>
      </footer>
    </div>
  );
}
