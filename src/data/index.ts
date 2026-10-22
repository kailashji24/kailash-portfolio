/**
 * src/data/index.ts
 *
 * Single source of truth for ALL portfolio copy. Components never hardcode
 * user-facing text — edit here and every section (and the mailto helper)
 * picks it up.
 *
 * Content rule: every project fact below is verifiable in the linked repo.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Project {
  /** Unique slug used as React key */
  id: string
  title: string
  /** One-sentence "what it is / what problem it solves" */
  summary: string
  /** 2–3 concrete, verifiable facts (numbers where the code supports them) */
  outcomes: string[]
  stack: string[]
  githubUrl: string
  /** Optional badge, e.g. 'Featured' or 'Published' */
  highlight?: string
  /** Featured card spans the full grid width and shows `architecture` */
  featured?: boolean
  /** Left-to-right data flow shown on the featured card */
  architecture?: string[]
}

export interface ExperienceEntry {
  id: string
  role: string
  company: string
  /** e.g. 'Oct 2025 – Dec 2025' */
  period: string
  bullets: string[]
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export interface Certification {
  id: string
  title: string
  issuer: string
  /** Month + year, e.g. 'Mar 2025' */
  date: string
  type: 'certification' | 'publication'
  /** Optional link to the certificate / paper PDF */
  url?: string
}

export interface ContactInfo {
  email: string
  github: string
  linkedin: string
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const profile = {
  name: 'Kailash Chaudhary',
  role: 'Cloud & DevOps Engineer',
  secondaryRoles: 'Python backend · AI/ML',
  tagline:
    'I automate how software gets built, shipped and watched — CI/CD pipelines, Terraform on AWS, Kubernetes, and the occasional RAG service.',
  bio: [
    'Cloud & DevOps engineer (B.E. Computer Science, 2025) who likes the unglamorous parts of shipping software: pipelines that run on every push, infrastructure that lives in Git, and alarms that fire before users notice.',
    'Most recently I worked as a Cloud & DevOps intern at TechEazy Consulting on AWS — Terraform, CodeDeploy, CloudWatch and WAF. Outside work I build end-to-end projects, from a Kubernetes-deployed RAG service to a Jenkins-driven Flask stack.',
  ],
  availability: 'Available immediately · Open to relocation anywhere in India',
  resumeUrl: '/Kailash_Chaudhary_Resume.pdf',
  siteUrl: 'https://kailash-portfolio-eight.vercel.app',
} as const

export const education = {
  institution: 'Pravara Rural Engineering College',
  institutionShort: 'PREC',
  university: 'Savitribai Phule Pune University',
  universityShort: 'SPPU',
  degree: 'B.E. in Computer Engineering',
  year: '2025',
  cgpa: '7.90 / 10',
  location: 'Loni, Maharashtra',
} as const

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certs', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
] as const

// ---------------------------------------------------------------------------
// Projects — ordered by relevance to Cloud/DevOps roles
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    id: 'llm-rag',
    title: 'LLM Document Q&A — RAG Service on Kubernetes',
    summary:
      'Ask questions of PDF documents and get answers grounded in the source pages, served as a FastAPI microservice and deployed to a Kubernetes cluster.',
    outcomes: [
      '1000/200-char chunking, 384-dim MiniLM embeddings and top-4 FAISS retrieval — every answer cites file and page',
      'Kubernetes Deployment with readiness/liveness probes, ConfigMap + Secret, and CPU/memory requests and limits',
      'GitHub Actions CI on every push and PR: import checks across 18 modules, smoke tests and a compile step',
    ],
    stack: ['FastAPI', 'LangChain', 'FAISS', 'HuggingFace', 'Groq Llama 3.1', 'Docker', 'Kubernetes', 'GitHub Actions'],
    githubUrl: 'https://github.com/kailashji24/llm-document-qa-rag',
    highlight: 'Featured',
    featured: true,
    architecture: ['PDF upload', 'Chunk', 'Embed (MiniLM)', 'FAISS search', 'Llama 3.1 via Groq', 'Answer + sources'],
  },
  {
    id: 'lift-shift',
    title: 'AWS Lift & Shift — Push-to-Deploy Pipeline',
    summary:
      'Migrated a Java (Spring MVC) app to AWS with a pipeline that takes a push on main all the way to running instances behind a load balancer.',
    outcomes: [
      'Every push builds with Maven, ships the artifact to S3 and triggers a CodeDeploy rollout to an Auto Scaling Group',
      'VPC, security groups, ALB, ASG, IAM roles and the CodeDeploy group are 100% Terraform — no console clicks',
      'Scripted CodeDeploy lifecycle hooks (stop → fix permissions → start) in appspec.yml',
    ],
    stack: ['Terraform', 'AWS EC2 / ASG / ALB', 'S3', 'CodeDeploy', 'IAM', 'GitHub Actions', 'Java 17'],
    githubUrl: 'https://github.com/kailashji24/Lift-Shift-Automation',
  },
  {
    id: 'health-agent',
    title: 'Project Health Reporting Agent',
    summary:
      'Turns Microsoft Project plans into a Red/Amber/Green health score, a JSON report and an executive PowerPoint — the LLM only explains the result.',
    outcomes: [
      'Deterministic scoring engine: 7 weighted components and 26 threshold rules, tuned through YAML config',
      'Run on real plans of 286 and 366 tasks; outputs a 6-slide deck per project plus a portfolio roll-up',
      'FastAPI service (3 endpoints) with an hourly scheduler; Groq via LangChain with a local fallback',
    ],
    stack: ['Python', 'pandas', 'FastAPI', 'LangChain', 'Groq', 'python-pptx', 'APScheduler', 'pytest'],
    githubUrl: 'https://github.com/kailashji24/project-health-reporting-agent',
  },
  {
    id: 'flask-student',
    title: 'Student Registration — Flask on Docker + Jenkins',
    summary:
      'A student-records CRUD app shipped as a two-container stack and deployed by a Jenkins pipeline.',
    outcomes: [
      '4 routes, a 7-column MySQL schema and 6 server-side validation rules including unique email',
      'Docker Compose stack with a health-gated MySQL startup, persistent volume, and Gunicorn in production',
      '5-stage Jenkins pipeline: clone → validate Compose → build → deploy → status check',
    ],
    stack: ['Flask', 'SQLAlchemy', 'MySQL', 'Docker Compose', 'Gunicorn', 'Jenkins'],
    githubUrl: 'https://github.com/kailashji24/flask-student-registration-devops',
  },
  {
    id: 'activity-detection',
    title: 'Suspicious Activity Detection (Deep Learning)',
    summary:
      'Classifies surveillance clips as walking, running or fighting with a CNN + LSTM (LRCN) model, wrapped in a Streamlit app for uploads.',
    outcomes: [
      '82.67% test accuracy across 3 classes, trained on 300 videos as 30-frame 64×64 sequences',
      'Streamlit app: video upload, annotated output video, CSV prediction log and charts',
      'Co-authored a paper on the approach in IRJMETS (Feb 2025)',
    ],
    stack: ['TensorFlow', 'Keras', 'OpenCV', 'LRCN', 'Streamlit', 'Python'],
    githubUrl: 'https://github.com/kailashji24/Suspicious-Activity-Detection',
    highlight: 'Published',
  },
]

// ---------------------------------------------------------------------------
// Experience — newest first
// ---------------------------------------------------------------------------

export const experiences: ExperienceEntry[] = [
  {
    id: 'techeazy',
    role: 'Cloud & DevOps Intern',
    company: 'TechEazy Consulting',
    period: 'Oct 2025 – Dec 2025',
    bullets: [
      'Provisioned EC2, S3, IAM, ALB and Auto Scaling Groups with Terraform and Boto3, replacing manual console steps with version-controlled infrastructure',
      'Built a GitHub Actions → S3 → CodeDeploy pipeline deploying a Java app to EC2',
      'Set up CloudWatch dashboards and SNS alarms for CPU, network and error-rate thresholds',
      'Debugged IAM permission-boundary and pipeline YAML failures from logs; wrote the RCA notes and deployment runbooks',
      'Configured AWS WAF rate-limiting and geo-blocking rules',
    ],
  },
  {
    id: 'technogrowth',
    role: 'Cloud Associate Engineer Intern',
    company: 'TechnoGrowth Software Solutions',
    period: 'Dec 2023 – Jan 2024',
    bullets: [
      'Maintained Docker containers and Linux servers across development and staging',
      'Ran post-release validation checks and wrote onboarding docs and knowledge-base articles',
    ],
  },
]

// ---------------------------------------------------------------------------
// Skills — 5 groups, no duplicates
// ---------------------------------------------------------------------------

export const skillGroups: SkillGroup[] = [
  {
    category: 'Cloud & IaC',
    skills: ['AWS EC2', 'S3', 'IAM', 'VPC', 'ALB / ASG', 'CodeDeploy', 'WAF', 'Terraform', 'Boto3'],
  },
  {
    category: 'CI/CD & Containers',
    skills: ['GitHub Actions', 'Jenkins', 'Docker', 'Docker Compose', 'Kubernetes', 'Git'],
  },
  {
    category: 'Observability & Ops',
    skills: ['CloudWatch', 'SNS alarms', 'Linux', 'Bash', 'RCA & runbooks'],
  },
  {
    category: 'Backend',
    skills: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'SQLAlchemy', 'MySQL', 'pandas'],
  },
  {
    category: 'AI / ML',
    skills: ['LangChain', 'FAISS', 'HuggingFace', 'Groq Llama 3.1', 'TensorFlow / Keras', 'OpenCV'],
  },
]

// ---------------------------------------------------------------------------
// Certifications + publication
// ---------------------------------------------------------------------------

export const certifications: Certification[] = [
  {
    id: 'iit-cloud',
    title: 'Advanced Certification in Cloud Computing & DevOps',
    issuer: 'iHUB DivyaSampark, IIT Roorkee',
    date: 'Jul 2025',
    type: 'certification',
    url: '/certs/iit-roorkee-devops.pdf',
  },
  {
    id: 'aws-saa-course',
    title: 'AWS Solutions Architect – Associate (training course)',
    issuer: 'Intellipaat · Certificate of completion',
    date: 'Mar 2025',
    type: 'certification',
    url: '/certs/aws-saa.pdf',
  },
  {
    id: 'forage-aws',
    title: 'AWS Solutions Architecture Job Simulation',
    issuer: 'Forage',
    date: 'Jul 2025',
    type: 'certification',
    url: '/certs/forage-aws.pdf',
  },
  {
    id: 'irjmets',
    title: 'Investigation on Human Activity Recognition using Deep Learning',
    issuer: 'IRJMETS Vol. 07, Issue 02 · Co-author',
    date: 'Feb 2025',
    type: 'publication',
    url: '/papers/irjmets-har-2025.pdf',
  },
]

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contactInfo: ContactInfo = {
  email: 'kailash998955@gmail.com',
  github: 'https://github.com/kailashji24',
  linkedin: 'https://linkedin.com/in/kailash-chaudhary24',
}
