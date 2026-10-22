// src/components/Skills.tsx
// "The Arsenal" — skill groups from data/index.ts as cards of pills.

import { useRef } from 'react'
import { skillGroups } from '../data/index'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './SectionHeading'

interface SkillsProps {
  reducedMotion: boolean
}

export function Skills({ reducedMotion }: SkillsProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  useScrollReveal(gridRef, { reducedMotion, stagger: 0.08 })

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="section"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Skills" title="The Arsenal" id="skills-title" />

        <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {skillGroups.map((group) => (
            <div key={group.category} className="card flex flex-col gap-3 p-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gold">
                {group.category}
              </h3>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {group.skills.map((skill) => (
                  <li key={skill} className="chip">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
