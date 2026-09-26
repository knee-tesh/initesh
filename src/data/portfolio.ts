export interface ContactDetails {
  email: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface LeadershipPillar {
  title: string;
  description: string;
}

export interface CurrentWork {
  name: string;
  company: string;
  role: string;
  summary: string;
  scale: string;
  technologies: string[];
}

export interface CareerRole {
  period: string;
  role: string;
  company: string;
  focus: string;
}

export interface CapabilityGroup {
  title: string;
  items: string[];
}

export interface SelectedEngagement {
  name: string;
  kind: string;
  description: string;
  technologies: string[];
}

export interface PortfolioProfile {
  name: string;
}

export interface CaseStudy {
  role: string;
  metric: string;
  metricLabel: string;
  caption: string;
  contributions: string[];
}

export interface PortfolioData {
  profile: PortfolioProfile;
  title: string;
  company: string;
  location: string;
  experience: string;
  summary: string;
  leadershipPillars: LeadershipPillar[];
  caseStudy: CaseStudy;
  currentWork: CurrentWork;
  career: CareerRole[];
  capabilities: CapabilityGroup[];
  tooling: string[];
  engagements: SelectedEngagement[];
  contact: ContactDetails;
  suggestedQuestions: string[];
}

const caseStudy: CaseStudy = {
  role: 'Principal Architect / Technical Lead',
  metric: '50K+',
  metricLabel: 'concurrent channels',
  caption:
    'concurrent channels on an enterprise platform that connects custom telephony systems to a cloud platform.',
  contributions: [
    'Architecture and technical direction across distributed systems',
    'Reliability-focused design for enterprise-scale traffic',
    'Cross-team alignment from platform strategy to delivery',
  ],
};

export const portfolioData: PortfolioData = {
  profile: { name: 'Nitesh Tiwari' },
  title: 'Principal Software Engineer',
  company: 'Genesys Telecom',
  location: 'Bangalore, India',
  experience: '10+ years',
  summary: 'Principal Software Engineer with 10+ years of experience building and owning cloud-based applications and integrations.',
  leadershipPillars: [
    {
      title: 'Set technical direction',
      description: 'Sets technical direction and owns architecture for assigned initiatives.',
    },
    {
      title: 'Raise engineering quality',
      description: 'Owns systems end-to-end, from requirements through deployment and customer enablement.',
    },
    {
      title: 'Multiply engineers',
      description:
        'Code review, pairing, design critique, and RFC reviews raise team autonomy rather than adding approval gates.',
    },
  ],
  caseStudy,
  currentWork: {
    name: 'Genesys BYOI Platform',
    company: 'Genesys Telecom',
    role: 'Principal Software Engineer',
    summary: 'Building distributed, event-driven infrastructure that enables enterprise customers to connect custom telephony systems to a cloud platform.',
    scale: `${caseStudy.metric} ${caseStudy.metricLabel}`,
    technologies: ['Distributed systems', 'Event-driven architecture', 'AWS', 'Reliability'],
  },
  career: [
    {
      period: '2024 – Present',
      role: 'Principal Software Engineer',
      company: 'Genesys Telecom',
      focus: 'BYOI platform and AI-driven JIRA automation',
    },
    {
      period: '2021 – 2024',
      role: 'Senior Consultant',
      company: 'Hitachi Digital Services',
      focus: 'AWS Lambda, Step Functions, and publish-subscribe architecture',
    },
    {
      period: '2020 – 2021',
      role: 'Full Stack Developer',
      company: 'DoctorC',
      focus: 'Razorpay payments and WhatsApp Business API',
    },
    {
      period: '2019 – 2020',
      role: 'Frontend Developer',
      company: 'Propellor.ai',
      focus: 'SaaS charting library with d3.js and ECharts',
    },
    {
      period: '2016 – 2019',
      role: 'Senior Software Engineer',
      company: 'Tech Mahindra',
      focus: 'ELK stack integration for OTRS',
    },
  ],
  capabilities: [
    {
      title: 'Cloud & platforms',
      items: [
        'AWS Lambda',
        'AWS S3',
        'AWS SQS',
        'AWS Step Functions',
        'AWS EventBridge',
        'AWS SES',
        'AWS API Gateway',
        'AWS CloudWatch',
        'AWS X-Ray',
        'Event-driven architecture',
      ],
    },
    {
      title: 'Backend systems',
      items: [
        'Python',
        'JavaScript',
        'SQL',
        'Perl',
        'PostgreSQL',
        'Redis',
        'Elasticsearch',
        'MongoDB',
        'DynamoDB',
        'Node.js',
        'Express.js',
        'REST APIs',
        'Django',
      ],
    },
    {
      title: 'Architecture',
      items: [
        'Genesys Cloud',
        'ServiceNow',
        'Microsoft Dynamics 365',
        'Salesforce',
        'Pega',
        'Amazon Connect',
        'System Design',
        'Architecture',
      ],
    },
    {
      title: 'Leadership',
      items: ['RFCs', 'System design', 'Mentoring', 'Production readiness'],
    },
  ],
  tooling: ['Claude', 'Codex', 'Cursor', 'Git', 'Linux', 'JIRA'],
  engagements: [
    {
      name: 'GuardEye Enterprises',
      kind: 'E-commerce',
      description: 'Security solutions e-commerce website with a product catalog, lead-generation flows, and quote requests.',
      technologies: ['Next.js 15', 'React 19', 'Tailwind CSS'],
    },
    {
      name: 'Aatmiya Foundation',
      kind: 'Non-Profit',
      description: 'Elder-care non-profit website with events, volunteer management, donation support, and community engagement.',
      technologies: ['Next.js', 'React', 'Tailwind CSS'],
    },
    {
      name: 'd3.js and ECharts visualization library',
      kind: 'Product Engineering',
      description: 'In-house visualization library for a multi-tenant SaaS platform, including funnel and heat-map visualizations.',
      technologies: ['d3.js', 'ECharts', 'Angular'],
    },
  ],
  contact: {
    email: 'tiwari.nitesh294@gmail.com',
    location: 'Bangalore, India',
    linkedin: 'https://www.linkedin.com/in/itiwarinitesh/',
    github: 'https://github.com/knee-tesh',
  },
  suggestedQuestions: [
    'What is Nitesh’s current role and engineering focus?',
    'How does Nitesh approach technical leadership and engineering quality?',
    'What is the Genesys BYOI case about?',
    'How can I contact Nitesh?',
  ],
};
