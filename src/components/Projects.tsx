// src/components/Projects.tsx
// Projects section — "The Treasure"
// Renders all four projects from data/index.ts as weathered bounty-poster cards.
//
// Props:
//   reducedMotion: boolean — disables tilt and hover animations when true

import { useEffect, useState } from 'react'
import { Tilt } from 'react-tilt'
import { projects } from '../data/index'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import { theme } from '../theme'

interface ProjectsProps {
  reducedMotion: boolean
}

export function Projects({ reducedMotion }: ProjectsProps) {
  return (
    <section
      id="projects"
      aria-label="Projects"
      style={{ backgroundColor: 'var(--bg-navy-mid)' }}
      className="py-20 px-6 md:px-12"
    >
      {/* ── Max-width container ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto">

        {/* ── Section heading ───────────────────────────────────────────────
            Cinzel display font, gold colour, centered
        */}
        <h2
          className="text-center text-3xl sm:text-4xl mb-14 tracking-widest uppercase"
          style={{
            fontFamily: theme.fonts.display,
            color: '#E8B23A',
          }}
        >
          The Treasure
        </h2>

        {/* ── Project cards grid ────────────────────────────────────────────
            1 col on mobile, 2 col on md+ (task 7.1)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// ProjectCard — weathered bounty poster card with optional tilt (task 7.2, 7.3)
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: (typeof projects)[number]
  reducedMotion: boolean
}

function ProjectCard({ project, reducedMotion }: ProjectCardProps) {
  // Disable tilt below 768px viewport width (task 7.2)
  const [isNarrow, setIsNarrow] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    setIsNarrow(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Tilt is disabled when reducedMotion is true or viewport < 768px (task 7.2)
  const tiltDisabled = reducedMotion || isNarrow
  const tiltOptions = tiltDisabled
    ? { max: 0, scale: 1, speed: 400 }
    : { max: 15, scale: 1.04, speed: 400 }

  return (
    <Tilt options={tiltOptions} className="h-full">
      <CardInner project={project} reducedMotion={reducedMotion} />
    </Tilt>
  )
}

// ---------------------------------------------------------------------------
// CardInner — the styled bounty-poster surface (task 7.3, 7.4)
// ---------------------------------------------------------------------------

interface CardInnerProps {
  project: (typeof projects)[number]
  reducedMotion: boolean
}

function CardInner({ project, reducedMotion }: CardInnerProps) {
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    if (!reducedMotion) setHovered(true)
  }
  const handleMouseLeave = () => {
    setHovered(false)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        /* Dark navy gradient — weathered bounty poster (task 7.3) */
        background: 'linear-gradient(135deg, #0A1428 0%, #0D1B2E 100%)',
        border: '1px solid rgba(44,95,124,0.5)',
        boxShadow: hovered
          ? '0 0 16px rgba(232,178,58,0.4)'
          : '0 0 0 rgba(232,178,58,0)',
        transition: reducedMotion ? 'none' : 'box-shadow 300ms ease',
        /* Noise overlay via pseudo-element alternative: inline noise using a
           repeating SVG data-URI at low opacity to simulate paper texture */
        position: 'relative',
        overflow: 'hidden',
      }}
      className="rounded-xl p-6 flex flex-col gap-4 h-full"
    >
      {/* ── Low-opacity noise overlay (task 7.3) ──────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          opacity: 0.04,
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }}
      />

      {/* ── Content layer ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-4 h-full">

        {/* ── Title row with optional highlight badge ───────────────────── */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-lg font-bold leading-snug"
            style={{
              fontFamily: theme.fonts.display,
              color: '#E8B23A',
            }}
          >
            {project.title}
          </h3>

          {project.highlight && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 mt-0.5"
              style={{
                backgroundColor: 'rgba(232,178,58,0.15)',
                color: '#E8B23A',
                border: '1px solid rgba(232,178,58,0.4)',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {project.highlight}
            </span>
          )}
        </div>

        {/* ── Subtitle / impact summary (task 7.4) ─────────────────────── */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: '#8FA3B8' }}
        >
          {project.subtitle}
        </p>

        {/* ── Stack tag pills (task 7.3, 7.4) ──────────────────────────── */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-medium select-none"
              style={{
                backgroundColor: '#1B3A5B',
                color: '#E8EDF2',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── GitHub link (task 7.4) ────────────────────────────────────── */}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...CURSOR_INTERACTIVE}
          className="inline-flex items-center gap-2 text-sm font-medium mt-2 self-start"
          style={{
            color: '#E8B23A',
            textDecoration: 'none',
            transition: reducedMotion ? 'none' : 'opacity 200ms ease',
            fontFamily: '"Inter", sans-serif',
            // Meets 44×44px minimum tap target for mobile (task 11.4)
            minHeight: '44px',
            padding: '0.25rem 0',
          }}
          onMouseEnter={(e) => {
            if (!reducedMotion)
              (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLAnchorElement).style.opacity = '1'
          }}
          aria-label={`View ${project.title} on GitHub`}
        >
          {/* GitHub icon (inline SVG) */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  )
}
