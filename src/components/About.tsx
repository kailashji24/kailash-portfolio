// src/components/About.tsx
// About section — biography, education stats, and availability note.
//
// Layout:
//   - <section id="about"> with navyLight (#0D1B2E) background
//   - <h2> "The Navigator" in Cinzel font, gold color, centered
//   - Bio paragraph (cloud/DevOps summary)
//   - Education stat card (PREC / SPPU, 2025, CGPA 7.90, Pune)
//   - Availability note
//
// Content: sourced from local constants (no inline hardcoding in JSX)
// Scroll reveal: deferred to task 5.2

import { theme } from '../theme'

// ── Local content constants — no inline hardcoding in JSX ─────────────────

const SECTION_HEADING = 'The Navigator'

const BIO_TEXT =
  'Cloud & DevOps engineer with hands-on experience building CI/CD pipelines, ' +
  'Kubernetes clusters, Terraform infrastructure, and RAG-based AI systems. ' +
  'Graduated from PREC (SPPU), Pune, and eager to ship real systems at scale.'

const EDUCATION = {
  institution:     'PREC',
  institutionFull: 'Pravara Rural Engineering College',
  university:      'SPPU',
  universityFull:  'Savitribai Phule Pune University (SPPU)',
  degree:          'B.E. in Computer Engineering',
  year:            '2025',
  cgpa:            '7.90',
  location:        'Pune, Maharashtra',
} as const

const AVAILABILITY = 'Currently open to opportunities · Open to relocation to Bengaluru'

// ── Component ──────────────────────────────────────────────────────────────

interface AboutProps {
  reducedMotion: boolean
}

export function About({ reducedMotion: _reducedMotion }: AboutProps) {
  return (
    <section
      id="about"
      aria-label="About"
      className="py-20 px-6 md:px-12"
      style={{ backgroundColor: 'var(--bg-navy-mid)' }}
    >
      {/* ── Max-width content wrapper ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">

        {/* ── Section Heading ───────────────────────────────────────────────── */}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl mb-8 text-center"
          style={{
            fontFamily: theme.fonts.display,
            color: theme.colors.gold.primary,
            letterSpacing: '0.04em',
          }}
        >
          {SECTION_HEADING}
        </h2>

        {/* ── Bio ──────────────────────────────────────────────────────────── */}
        <p
          className="mb-10 leading-relaxed text-base md:text-lg"
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.fonts.body,
            maxWidth: '65ch',
          }}
        >
          {BIO_TEXT}
        </p>

        {/* ── Education Card ────────────────────────────────────────────────── */}
        <div
          className="rounded-lg p-6 md:p-8 mb-10"
          style={{
            backgroundColor: theme.colors.accent.ocean,
            border: `1px solid ${theme.colors.accent.oceanMid}`,
          }}
        >
          {/* Card heading */}
          <h3
            className="text-sm uppercase tracking-widest mb-5"
            style={{
              color: theme.colors.text.secondary,
              fontFamily: theme.fonts.body,
              fontWeight: 600,
            }}
          >
            Education
          </h3>

          {/* Institution + degree */}
          <div className="mb-5">
            <p
              className="text-lg font-semibold"
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body,
              }}
            >
              {EDUCATION.institutionFull}{' '}
              <span
                className="text-sm font-normal"
                style={{ color: theme.colors.text.secondary }}
              >
                ({EDUCATION.institution})
              </span>
            </p>
            <p
              className="text-sm mt-0.5"
              style={{
                color: theme.colors.text.secondary,
                fontFamily: theme.fonts.body,
              }}
            >
              {EDUCATION.degree}
            </p>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* University */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.body }}
              >
                University
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.body }}
                title={EDUCATION.universityFull}
              >
                {EDUCATION.university}
              </span>
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.body }}
              >
                Year
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.body }}
              >
                {EDUCATION.year}
              </span>
            </div>

            {/* CGPA */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.body }}
              >
                CGPA
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: theme.colors.gold.primary, fontFamily: theme.fonts.body }}
              >
                {EDUCATION.cgpa}
              </span>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.body }}
              >
                Location
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.body }}
              >
                {EDUCATION.location}
              </span>
            </div>

          </div>
        </div>

        {/* ── Availability Note ─────────────────────────────────────────────── */}
        <p
          className="text-sm md:text-base"
          style={{
            color: theme.colors.text.secondary,
            fontFamily: theme.fonts.body,
          }}
        >
          <span
            className="inline-block mr-2"
            style={{
              color: theme.colors.gold.primary,
              fontWeight: 600,
            }}
          >
            ●
          </span>
          {AVAILABILITY}
        </p>

      </div>
    </section>
  )
}
