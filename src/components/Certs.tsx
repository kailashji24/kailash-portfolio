// src/components/Certs.tsx
// Certifications section — "The Marks"
// Renders 3 certification cards + 1 publication card from data/index.ts.
//
// Layout:
//   - <section id="certs"> with navyLight (#0D1B2E) background (alternating)
//   - <h2> "The Marks" in Cinzel font, gold colour, centered
//   - 2-column responsive grid (1 col mobile, 2 col sm+)
//   - Each card shows: title, issuer, date, and a type badge
//   - Certification badge: gold; Publication badge: ocean teal
//   - Scroll reveal via useScrollReveal with stagger 0.1s
//
// Props:
//   reducedMotion: boolean — disables scroll-reveal animations when true

import { useRef } from 'react'
import { certifications } from '../data/index'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { theme } from '../theme'

interface CertsProps {
  reducedMotion: boolean
}

// ── Section heading constant ────────────────────────────────────────────────
const SECTION_HEADING = 'The Marks'

// ── Badge colours by type ───────────────────────────────────────────────────
const BADGE_STYLES = {
  certification: {
    backgroundColor: 'rgba(232,178,58,0.15)',
    color: theme.colors.gold.primary,
    border: '1px solid rgba(232,178,58,0.4)',
    label: 'Certification',
  },
  publication: {
    backgroundColor: 'rgba(44,95,124,0.25)',
    color: '#8FA3B8',
    border: '1px solid rgba(143,163,184,0.45)',
    label: 'Publication',
  },
} as const

// ── Certs section ──────────────────────────────────────────────────────────

export function Certs({ reducedMotion }: CertsProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  // Stagger 0.1s between cards; respects reducedMotion (task 9.3)
  useScrollReveal(gridRef, {
    stagger: 0.1,
    reducedMotion,
  })

  return (
    <section
      id="certs"
      aria-label="Certifications"
      style={{ backgroundColor: 'var(--bg-navy-mid)' }}
      className="py-20 px-6 md:px-12"
    >
      {/* ── Max-width container ───────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">

        {/* ── Section heading ───────────────────────────────────────────────
            Cinzel display font, gold colour, centered (tasks 9.1 / 9.3)
        */}
        <h2
          className="text-center text-3xl sm:text-4xl mb-14 tracking-widest uppercase"
          style={{
            fontFamily: theme.fonts.display,
            color: theme.colors.gold.primary,
          }}
        >
          {SECTION_HEADING}
        </h2>

        {/* ── Cards grid ────────────────────────────────────────────────────
            1 col on mobile, 2 col on sm+ (tasks 9.1 / 9.2)
            ref attached for useScrollReveal (task 9.3)
        */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {certifications.map((cert) => {
            const badge = BADGE_STYLES[cert.type]

            return (
              <div
                key={cert.id}
                className="rounded-lg p-6 flex flex-col gap-3"
                style={{
                  backgroundColor: theme.colors.base.navy,
                  border: `1px solid ${theme.colors.accent.ocean}`,
                }}
              >
                {/* ── Type badge (Certification / Publication) ───────────── */}
                <span
                  className="self-start text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: badge.backgroundColor,
                    color: badge.color,
                    border: badge.border,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {badge.label}
                </span>

                {/* ── Certificate / paper title ─────────────────────────── */}
                <h3
                  className="text-base font-bold leading-snug"
                  style={{
                    fontFamily: theme.fonts.display,
                    color: theme.colors.text.primary,
                  }}
                >
                  {cert.title}
                </h3>

                {/* ── Issuer + date row ─────────────────────────────────── */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span
                    className="text-sm"
                    style={{
                      color: theme.colors.text.secondary,
                      fontFamily: theme.fonts.body,
                    }}
                  >
                    {cert.issuer}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: theme.colors.accent.ocean,
                        color: theme.colors.text.secondary,
                        fontFamily: theme.fonts.body,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cert.date}
                    </span>

                    {/* Download button — only for certifications with a PDF url */}
                    {cert.type === 'certification' && cert.url && (
                      <a
                        href={cert.url}
                        download
                        aria-label={`Download ${cert.title} certificate`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: theme.colors.gold.primary,
                          textDecoration: 'none',
                          fontFamily: theme.fonts.body,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.6rem',
                          border: `1px solid rgba(232,178,58,0.4)`,
                          borderRadius: '4px',
                          backgroundColor: 'rgba(232,178,58,0.08)',
                          whiteSpace: 'nowrap',
                          transition: 'background-color 150ms ease, box-shadow 150ms ease',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget
                          el.style.backgroundColor = 'rgba(232,178,58,0.18)'
                          el.style.boxShadow = '0 0 8px rgba(232,178,58,0.35)'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget
                          el.style.backgroundColor = 'rgba(232,178,58,0.08)'
                          el.style.boxShadow = ''
                        }}
                      >
                        {/* Download arrow icon */}
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                          <path d="M8 12L3 7h3V2h4v5h3L8 12z"/>
                          <rect x="2" y="13" width="12" height="1.5" rx="0.75"/>
                        </svg>
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
