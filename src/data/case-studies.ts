export interface CaseStudy {
  title: string; slug: string; company: string; role: string; domain: string;
  timeframe: string; scale: string; technologies: string[]; summary: string;
  problem: string; constraints: string[]; responsibility: string[];
  decisions: { title: string; options: string[]; chosen: string; why: string; tradeoff: string; outcome: string }[];
  failureModes: { name: string; detection: string; containment: string; recovery: string; impact: string }[];
  execution: string; technicalImpact: string; businessImpact: string;
  organizationalImpact: string; lessonsLearned: string;
}

export const caseStudies: CaseStudy[] = [
  {
    title: "Genesys BYOI Platform",
    slug: "genesys-byoi",
    company: "Genesys Telecom",
    role: "Principal Architect / Technical Lead",
    domain: "Enterprise Telephony",
    timeframe: "2024 – Present",
    scale: "50K+ concurrent channels",
    technologies: ["Distributed Systems", "AWS", "Event-Driven", "Reliability"],
    summary: "Building infrastructure that enables enterprise customers to connect custom telephony systems to a cloud platform.",
    problem: "TODO(content): verify with truth layer before publish.",
    constraints: ["TODO(content)"],
    responsibility: ["TODO(content)"],
    decisions: [],
    failureModes: [],
    execution: "TODO(content)",
    technicalImpact: "TODO(content)",
    businessImpact: "TODO(content)",
    organizationalImpact: "TODO(content)",
    lessonsLearned: "TODO(content)",
  },
];
