export type CommandResult =
  | { kind: "output"; lines: string[] }
  | { kind: "navigate"; href: string }
  | { kind: "help" }
  | { kind: "unknown" };

const NAV: Record<string, string> = {
  work: "/work",
  architecture: "/architecture",
  experience: "/experience",
  writing: "/writing",
  about: "/about",
  contact: "/contact",
};

export function resolveCommand(raw: string): CommandResult {
  const cmd = raw.trim().toLowerCase();
  if (cmd === "whoami") {
    return {
      kind: "output",
      lines: [
        "Principal Software Engineer",
        "10+ years",
        "Distributed Systems",
        "Cloud Architecture",
        "Technical Leadership",
      ],
    };
  }
  if (cmd === "resume") return { kind: "navigate", href: "/resume" };
  if (cmd === "help") return { kind: "help" };
  if (NAV[cmd]) return { kind: "navigate", href: NAV[cmd] };
  return { kind: "unknown" };
}
