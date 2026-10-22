// src/components/Experience.tsx
// "The Logbook" — vertical timeline. The line sits on the left at every
// breakpoint so cards use the full content width (no empty half on desktop).

import { useRef } from 'react'
import { experiences } from '../data/index'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionHeading } from './SectionHeading'

interface ExperienceProps {
  reducedMotion: boolean
}

export function Experience({ reducedMotion }: ExperienceProps) {
  const listRef = useRef<HTMLOListElement>(null)
  useScrollReveal(listRef, { reducedMotion, stagger: 0.15, y: 24 })

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="section"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Experience" title="The Logbook" id="experience-title" />

        <div className="relative">
          {/* Timeline line */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-2 w-0.5 md:left-[185px]"
            style={{ background: 'linear-gradient(to bottom, #E8B23A, #1B3A5B)' }}
          />

          <ol ref={listRef} className="m-0 flex list-none flex-col gap-10 p-0">
            {experiences.map((entry) => (
              <li key={entry.id} className="relative grid grid-cols-1 gap-3 pl-8 md:grid-cols-[160px_1fr] md:gap-10 md:pl-0">
                {/* Dot */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-gold md:left-[178px]"
                  style={{ boxShadow: '0 0 8px rgba(232,178,58,0.6)' }}
                />

                {/* Date — left column on desktop */}
                <p className="m-0 whitespace-nowrap text-sm font-semibold text-textSecondary md:pt-1 md:text-right">
                  {entry.period}
                </p>

                <div className="card p-6 md:ml-4">
                  <h3 className="font-display text-lg font-bold text-gold">{entry.role}</h3>
                  <p className="mb-4 mt-1 text-sm text-textSecondary">{entry.company}</p>
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm leading-relaxed text-textPrimary">
                        <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
