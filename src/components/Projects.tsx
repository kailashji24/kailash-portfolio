// src/components/Projects.tsx
// "The Treasure" — project cards. Each card answers: what is it, what did it
// achieve (verifiable facts), what's it built with, where's the code.
// The featured project spans the full width and shows its data flow.

import { useRef } from 'react'
import { projects, type Project } from '../data/index'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useTilt } from '../hooks/useTilt'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import { SectionHeading } from './SectionHeading'

interface ProjectsProps {
  reducedMotion: boolean
}

export function Projects({ reducedMotion }: ProjectsProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  useScrollReveal(gridRef, { reducedMotion, stagger: 0.12 })

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="section"
      style={{ backgroundColor: 'var(--bg-navy-mid)' }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Projects" title="The Treasure" id="projects-title" />

        <div ref={gridRef} className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project) => (
            // Wrapper owns the scroll-reveal transform; the card inside owns the tilt
            <div key={project.id} className={project.featured ? 'md:col-span-2' : undefined}>
              <ProjectCard project={project} reducedMotion={reducedMotion} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, reducedMotion }: { project: Project; reducedMotion: boolean }) {
  const cardRef = useRef<HTMLElement>(null)
  // Featured card is wide — a smaller angle keeps it from feeling wobbly
  useTilt(cardRef, { max: project.featured ? 2.5 : 5, disabled: reducedMotion })

  const titleId = `project-${project.id}-title`

  return (
    <article
      ref={cardRef}
      aria-labelledby={titleId}
      className={`card card-hover relative flex h-full flex-col gap-5 overflow-hidden p-6 md:p-7 ${
        project.featured ? 'border-gold/40' : ''
      }`}
      style={{ background: 'linear-gradient(135deg, #0A1428 0%, #0D1B2E 100%)' }}
    >
      {/* Paper-grain texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative flex h-full flex-col gap-5">
        <header className="flex items-start justify-between gap-3">
          <h3 id={titleId} className="font-display text-lg font-bold leading-snug text-gold md:text-xl">
            {project.title}
          </h3>
          {project.highlight && (
            <span className="mt-0.5 shrink-0 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold">
              {project.highlight}
            </span>
          )}
        </header>

        <p className="text-sm leading-relaxed text-textPrimary md:text-[0.95rem]">{project.summary}</p>

        {project.architecture && <ArchitectureFlow steps={project.architecture} />}

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {project.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2.5 text-sm leading-relaxed text-textSecondary">
              <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {o}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-4">
          <ul aria-label="Tech stack" className="m-0 flex list-none flex-wrap gap-2 p-0">
            {project.stack.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            {...CURSOR_INTERACTIVE}
            className="link-gold self-start text-sm"
            aria-label={`View ${project.title} source code on GitHub (opens in a new tab)`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View source on GitHub
          </a>
        </div>
      </div>
    </article>
  )
}

/** Horizontal (wraps on mobile) pipeline of steps joined by arrows. */
function ArchitectureFlow({ steps }: { steps: string[] }) {
  return (
    <figure className="m-0 rounded-lg border border-oceanMid/50 bg-navy/60 p-4">
      <figcaption className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-textSecondary">
        How it works
      </figcaption>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-1.5 gap-y-2 p-0">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                i === 0 || i === steps.length - 1
                  ? 'border-gold/50 bg-gold/10 text-gold'
                  : 'border-oceanMid bg-ocean/60 text-textPrimary'
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" className="text-textSecondary">
                <path d="M0 5h11M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}
