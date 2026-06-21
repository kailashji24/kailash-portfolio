// src/components/Experience.tsx
// Experience section — "The Logbook"
// Renders both experience entries from data/index.ts as a vertical timeline.
//
// Layout:
//   - <section id="experience"> with navy (#0A1428) background (alternating from Projects)
//   - <h2> "The Logbook" in Cinzel font, gold color, centered
//   - Vertical timeline with a 2px gold-to-ocean gradient connecting line
//   - Desktop: content to the right of the center line
//   - Mobile (<768px): single column, line on left edge
//
// Props:
//   reducedMotion: boolean — disables scroll reveal animations when true

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experiences, type ExperienceEntry } from '../data/index'
import { theme } from '../theme'

interface ExperienceProps {
  reducedMotion: boolean
}

// ── Section heading constant — no inline hardcoding in JSX ─────────────────
const SECTION_HEADING = 'The Logbook'

// ── Experience section ─────────────────────────────────────────────────────

export function Experience({ reducedMotion }: ExperienceProps) {
  return (
    <section
      id="experience"
      aria-label="Experience"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
      className="py-20 px-6 md:px-12"
    >
      {/* ── Max-width container ───────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">

        {/* ── Section heading ───────────────────────────────────────────────
            Cinzel display font, gold colour, centered
        */}
        <h2
          className="text-center text-3xl sm:text-4xl mb-16 tracking-widest uppercase"
          style={{
            fontFamily: theme.fonts.display,
            color: theme.colors.gold.primary,
          }}
        >
          {SECTION_HEADING}
        </h2>

        {/* ── Timeline container ────────────────────────────────────────────
            position: relative so the absolute connecting line is contained
        */}
        <div className="relative">

          {/* ── Vertical connecting line ──────────────────────────────────────
              Mobile: left: 20px (left edge)
              Desktop (md+): left: 50%, transform: translateX(-50%) (center)
              Gradient: gold (#E8B23A) → ocean (#1B3A5B)
          */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '2px',
              background: `linear-gradient(to bottom, ${theme.colors.gold.primary}, ${theme.colors.accent.ocean})`,
            }}
            className="
              left-[20px]
              md:left-1/2 md:-translate-x-1/2
            "
          />

          {/* ── Timeline nodes ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-12">
            {experiences.map((entry, index) => (
              <TimelineNode
                key={entry.id}
                entry={entry}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// TimelineNode — single experience entry on the timeline
// ---------------------------------------------------------------------------

interface TimelineNodeProps {
  entry: ExperienceEntry
  index: number
  reducedMotion: boolean
}

function TimelineNode({ entry, index, reducedMotion }: TimelineNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)

  // ── Scroll reveal ─────────────────────────────────────────────────────────
  // Animate each node: { opacity: 0, x: -30 } → visible
  // Stagger: 0.15s per index; ScrollTrigger start: "top 80%"
  // Killed on unmount; skipped entirely when reducedMotion is true.
  useEffect(() => {
    if (reducedMotion || !nodeRef.current) return

    const el = nodeRef.current

    // Set initial state
    gsap.set(el, { opacity: 0, x: -30 })

    // Create scroll-triggered animation with stagger offset
    const tween = gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: theme.motion.durationNormal / 1000,
      ease: theme.motion.ease,
      delay: index * 0.15,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      // Kill tween and its ScrollTrigger on unmount
      tween.kill()
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === el)
        .forEach((st) => st.kill())
    }
  }, [reducedMotion, index])

  return (
    /*
      Mobile layout:  dot on the line at left:20px, content shifted right (pl-14)
      Desktop layout: content on right side of center line (md:ml-[calc(50%+24px)])
                      The dot sits centered on the line via absolute positioning
    */
    <div
      ref={nodeRef}
      className="relative pl-14 md:pl-0 md:ml-[calc(50%+24px)]"
    >
      {/* ── Gold circle dot on the line ───────────────────────────────────────
          Mobile:  left: 20px, centered on the 2px line → left: calc(20px - 7px) = 13px
                   but the dot is 16px wide so center = left: 20px - 8px = 12px
          Desktop: left: 50%, transform: translateX(-50%) then shift left by half card offset
                   The dot must sit on the center line: left: calc(50% - 8px) relative to the
                   outer container — achieved via negative margin trick
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: theme.colors.gold.primary,
          boxShadow: `0 0 8px rgba(232,178,58,0.6)`,
          top: '24px',
          // Mobile: centered on the left-edge line (line at left:20px, dot width 16px)
          // Desktop: overridden via Tailwind md: class below — see wrapper div approach
        }}
        className="
          left-[12px]
          md:left-[-32px]
        "
      />

      {/* ── Content card ──────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: theme.colors.base.navyLight,
          border: `1px solid ${theme.colors.accent.ocean}`,
        }}
      >
        {/* ── Date badge ──────────────────────────────────────────────────── */}
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
          style={{
            backgroundColor: theme.colors.accent.ocean,
            color: theme.colors.text.secondary,
            fontFamily: theme.fonts.body,
          }}
        >
          {entry.period}
        </span>

        {/* ── Role title ──────────────────────────────────────────────────── */}
        <h3
          className="text-lg font-bold mb-1"
          style={{
            fontFamily: theme.fonts.display,
            color: theme.colors.gold.primary,
          }}
        >
          {entry.role}
        </h3>

        {/* ── Company name ────────────────────────────────────────────────── */}
        <p
          className="text-sm mb-4"
          style={{
            color: theme.colors.text.secondary,
            fontFamily: theme.fonts.body,
          }}
        >
          {entry.company}
        </p>

        {/* ── Bullet list of responsibilities / achievements ─────────────── */}
        <ul
          className="flex flex-col gap-2"
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {entry.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm leading-relaxed"
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body,
              }}
            >
              {/* Gold dot marker */}
              <span
                aria-hidden="true"
                style={{
                  color: theme.colors.gold.primary,
                  marginTop: '0.35em',
                  flexShrink: 0,
                  fontSize: '0.5rem',
                }}
              >
                ●
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
