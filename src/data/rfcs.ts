export interface RfcSection { id: string; title: string; body: string; }
export interface Rfc {
  id: string;
  title: string;
  category: string;
  date: string;
  readMinutes: number;
  sections: RfcSection[];
}

export const RFC_FILTERS = [
  "Distributed Systems", "Cloud", "Reliability", "Security", "Developer Experience", "AI / Tooling",
];

export const rfcs: Rfc[] = [
  {
    id: "RFC-001",
    title: "Transitioning from Monolithic Polling to Distributed Events",
    category: "Distributed Systems",
    date: "2026-01-15",
    readMinutes: 8,
    sections: [
      { id: "context", title: "Context", body: "TODO(content): describe the system and why the change was needed." },
      { id: "problem", title: "Problem", body: "TODO(content)" },
      { id: "goals", title: "Goals", body: "TODO(content)" },
      { id: "non-goals", title: "Non-goals", body: "TODO(content)" },
      { id: "constraints", title: "Constraints", body: "TODO(content)" },
      { id: "options", title: "Options", body: "TODO(content)" },
      { id: "architecture", title: "Proposed Architecture", body: "TODO(content)" },
      { id: "tradeoffs", title: "Trade-offs", body: "TODO(content)" },
      { id: "security", title: "Security", body: "TODO(content)" },
      { id: "operations", title: "Operational Considerations", body: "TODO(content)" },
      { id: "unresolved", title: "Unresolved Questions", body: "TODO(content)" },
      { id: "decision", title: "Decision", body: "TODO(content)" },
    ],
  },
];
