/**
 * src/data/index.ts
 *
 * Single source of truth for all portfolio content.
 * Every string displayed on the site originates here — no content is
 * hardcoded inside components.
 *
 * Exports:
 *   - Interfaces: Project, ExperienceEntry, SkillGroup, Certification, ContactInfo
 *   - Constants:  projects, experiences, skillGroups, certifications, publication,
 *                 contactInfo, HERO_ROLES
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Project {
  /** Unique slug used as React list key */
  id: string
  /** Card headline */
  title: string
  /** 1-2 line impact summary shown beneath the title */
  subtitle: string
  /** Technology stack badges */
  stack: string[]
  /** Valid HTTPS GitHub repository URL */
  githubUrl: string
  /** Optional featured / award tag, e.g. 'Featured' or 'Published' */
  highlight?: string
}

export interface ExperienceEntry {
  /** Unique slug used as React list key */
  id: string
  /** Job title */
  role: string
  /** Employer name */
  company: string
  /** Human-readable date range, e.g. 'Oct 2025 – Dec 2025' */
  period: string
  /** Bullet-point responsibilities / achievements */
  bullets: string[]
}

export interface SkillGroup {
  /** Category label shown as group heading */
  category: string
  /** Individual skill names rendered as badges */
  skills: string[]
}

export interface Certification {
  /** Unique slug used as React list key */
  id: string
  /** Certificate or paper title */
  title: string
  /** Issuing organisation or journal */
  issuer: string
  /** Month + year, e.g. 'Mar 2025' */
  date: string
  /** Distinguishes credentials from academic publications */
  type: 'certification' | 'publication'
  /** Optional verification / DOI link */
  url?: string
}

export interface ContactInfo {
  email: string
  /** Full GitHub profile URL */
  github: string
  /** Full LinkedIn profile URL */
  linkedin: string
  /** Short availability blurb shown in the Contact section */
  availability: string
}

// ---------------------------------------------------------------------------
// Hero — typing animation role strings + tagline
// ---------------------------------------------------------------------------

export const HERO_TAGLINE =
  'Early-career engineer shipping real cloud-scale systems — CI/CD, RAG pipelines, and infrastructure as code.'

export const HERO_ROLES: string[] = [
  'Cloud & DevOps Engineer',
  'Python Developer',
  'Backend Engineer',
  'AI/ML Builder',
]

// ---------------------------------------------------------------------------
// Projects (4 entries)
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  {
    id: 'llm-rag',
    title: 'LLM Document Q&A — RAG Pipeline',
    subtitle:
      'Production-grade RAG pipeline serving semantic document search via LLM. ' +
      'Deployed on Kubernetes with health probes, ConfigMaps & Secrets, and GitHub Actions CI.',
    stack: [
      'FastAPI',
      'LangChain',
      'FAISS',
      'HuggingFace',
      'Groq/Llama 3.1',
      'Kubernetes',
      'GitHub Actions',
    ],
    githubUrl: 'https://github.com/kailashji24/llm-document-qa-rag',
    highlight: 'Featured',
  },
  {
    id: 'aws-cicd',
    title: 'AWS CI/CD Lift & Shift Pipeline',
    subtitle:
      'Terraform-provisioned VPC/ALB/ASG/IAM/S3, GitHub Actions → S3 → CodeDeploy rolling ' +
      'deploy to EC2, CloudWatch dashboards + SNS alarms.',
    stack: ['Terraform', 'AWS', 'GitHub Actions', 'CodeDeploy', 'CloudWatch', 'SNS'],
    githubUrl: 'https://github.com/kailashji24/test-repo-for-devops-app',
  },
  {
    id: 'flask-student',
    title: 'Flask Student Registration System',
    subtitle:
      'Flask + MySQL + SQLAlchemy, Docker Compose multi-container, Gunicorn production server, ' +
      'Jenkins CI/CD pipeline.',
    stack: ['Flask', 'MySQL', 'SQLAlchemy', 'Docker Compose', 'Gunicorn', 'Jenkins'],
    githubUrl: 'https://github.com/kailashji24/flask-student-registration-devops',
  },
  {
    id: 'activity-detection',
    title: 'Suspicious Activity Detection System',
    subtitle:
      'LRCN (CNN+LSTM) video activity recognition with TensorFlow/Keras/OpenCV, Streamlit ' +
      'dashboard. Published in IRJMETS Vol.07, Feb 2025.',
    stack: ['TensorFlow', 'Keras', 'OpenCV', 'LRCN', 'Streamlit', 'Python'],
    githubUrl: 'https://github.com/kailashji24/Suspicious-Activity-Detection',
    highlight: 'Published',
  },
]

// ---------------------------------------------------------------------------
// Experience (2 entries)
// ---------------------------------------------------------------------------

export const experiences: ExperienceEntry[] = [
  {
    id: 'techeazy',
    role: 'Cloud & DevOps Intern',
    company: 'TechEazy Consulting',
    period: 'Oct 2025 – Dec 2025',
    bullets: [
      'Built GitHub Actions CI/CD pipeline for Java app deploying to AWS EC2',
      'Provisioned infrastructure with Terraform + Boto3 automation scripts',
      'Configured CloudWatch dashboards + SNS alarms for full-stack observability',
      'Implemented AWS WAF rate-limiting and geo-blocking rules',
      'Collaborated in Agile sprints with cross-functional team',
    ],
  },
  {
    id: 'technogrowth',
    role: 'Cloud Associate Engineer Intern',
    company: 'TechnoGrowth Software Solutions',
    period: 'Dec 2023 – Jan 2024',
    bullets: [
      'Managed Docker containers and Linux server environments',
      'Performed post-release validation and regression testing',
      'Authored onboarding documentation for cloud tooling and workflows',
    ],
  },
]

// ---------------------------------------------------------------------------
// Skill Groups (8 groups)
// ---------------------------------------------------------------------------

export const skillGroups: SkillGroup[] = [
  {
    category: 'CI/CD',
    skills: ['GitHub Actions', 'Jenkins', 'CodeDeploy'],
  },
  {
    category: 'Containers & Orchestration',
    skills: ['Docker', 'Kubernetes', 'Docker Compose'],
  },
  {
    category: 'AWS / Cloud',
    skills: ['EC2', 'S3', 'IAM', 'VPC', 'ALB', 'ASG', 'CloudWatch', 'WAF', 'Boto3'],
  },
  {
    category: 'IaC',
    skills: ['Terraform'],
  },
  {
    category: 'Observability',
    skills: ['CloudWatch', 'SNS Alarms'],
  },
  {
    category: 'Backend / APIs',
    skills: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'SQLAlchemy', 'MySQL'],
  },
  {
    category: 'AI / ML',
    skills: [
      'LangChain',
      'FAISS',
      'HuggingFace',
      'Groq/Llama 3.1',
      'RAG',
      'TensorFlow',
      'Keras',
      'OpenCV',
    ],
  },
  {
    category: 'Scripting & Tooling',
    skills: ['Python', 'Bash', 'Git'],
  },
]

// ---------------------------------------------------------------------------
// Certifications (3 credentials + 1 publication = 4 entries)
// ---------------------------------------------------------------------------

export const certifications: Certification[] = [
  {
    id: 'aws-saa',
    title: 'AWS Solutions Architect Associate',
    issuer: 'Intellipaat',
    date: 'Mar 2025',
    type: 'certification',
    url: '/certs/aws-saa.pdf',
  },
  {
    id: 'iit-cloud',
    title: 'Advanced Cloud Computing & DevOps',
    issuer: 'IIT Roorkee iHUB',
    date: 'Jul 2025',
    type: 'certification',
    url: '/certs/iit-roorkee-devops.pdf',
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
    issuer: 'IRJMETS Vol.07 Issue 02',
    date: 'Feb 2025',
    type: 'publication',
  },
]

// ---------------------------------------------------------------------------
// Contact Info
// ---------------------------------------------------------------------------

export const contactInfo: ContactInfo = {
  email: 'kailash998955@gmail.com',
  github: 'https://github.com/kailashji24',
  linkedin: 'https://linkedin.com/in/kailash-chaudhary24',
  availability: 'Available immediately · Open to relocation to Bengaluru',
}
