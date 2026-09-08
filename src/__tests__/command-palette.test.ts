import { resolveCommand } from "@/lib/command-palette";

test("whoami resolves to portfolio identity", () => {
  const out = resolveCommand("whoami");
  expect(out.kind).toBe("output");
  if (out.kind === "output") {
    expect(out.lines).toContain("Principal Software Engineer");
  }
});

test("navigation command maps to route", () => {
  const out = resolveCommand("work");
  expect(out).toEqual({ kind: "navigate", href: "/work" });
});

test("unknown command handled", () => {
  expect(resolveCommand("bogus").kind).toBe("unknown");
});
