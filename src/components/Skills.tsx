// src/components/Skills.tsx
// Skills section — "The Arsenal"
// Renders all 8 skill groups from skillGroups data as cards with pill badges.
//
// Props:
//   reducedMotion: boolean — disables hover transitions when true (reserved for scroll
//                            reveal in task 6.4; passed through now so App.tsx signature
//                            is stable)

import { skillGroups } from '../data/index'
import { theme } from '../theme'

interface SkillsProps {
  reducedMotion: boolean
}

export function Skills({ reducedMotion }: SkillsProps) {
  return (
    <section
      id="skills"
      aria-label="Skills"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
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
          The Arsenal
        </h2>

        {/* ── Skill group cards grid ────────────────────────────────────────
            1 col → 2 col → 3 col → 4 col responsive grid (satisfies task 6.3)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="rounded-lg p-5 flex flex-col gap-3"
              style={{ backgroundColor: '#0D1B2E' }}
            >
              {/* ── Category label ──────────────────────────────────────── */}
              <h3
                className="text-sm font-bold uppercase tracking-wider"
                style={{
                  fontFamily: theme.fonts.display,
                  color: '#E8B23A',
                }}
              >
                {group.category}
              </h3>

              {/* ── Skill pills ─────────────────────────────────────────── */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <SkillPill
                    key={skill}
                    skill={skill}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// SkillPill — individual badge with gold glow on hover (satisfies task 6.2)
// ---------------------------------------------------------------------------

interface SkillPillProps {
  skill: string
  reducedMotion: boolean
}

function SkillPill({ skill, reducedMotion }: SkillPillProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!reducedMotion) {
      ;(e.currentTarget as HTMLSpanElement).style.boxShadow =
        '0 0 8px rgba(232,178,58,0.7)'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    ;(e.currentTarget as HTMLSpanElement).style.boxShadow = 'none'
  }

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: '#1B3A5B',
        color: '#E8EDF2',
        transition: reducedMotion ? 'none' : 'box-shadow 250ms ease',
        boxShadow: 'none',
      }}
      className="text-xs px-3 py-1 rounded-full font-medium select-none"
    >
      {skill}
    </span>
  )
}
