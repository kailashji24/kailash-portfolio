// src/components/About.tsx
// "The Navigator" — short bio + education card. All copy comes from data/index.ts.

import { useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { education, profile } from '../data/index'
import { SectionHeading } from './SectionHeading'

interface AboutProps {
  reducedMotion: boolean
}

const STATS = [
  { label: 'University', value: education.universityShort, title: education.university },
  { label: 'Graduated', value: education.year },
  { label: 'CGPA', value: education.cgpa },
  { label: 'Location', value: education.location },
]

export function About({ reducedMotion }: AboutProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  useScrollReveal(contentRef, { reducedMotion, stagger: 0.1 })

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="section"
      style={{ backgroundColor: 'var(--bg-navy-mid)' }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="About" title="The Navigator" id="about-title" />

        <div ref={contentRef} className="flex flex-col gap-8">
          <div className="flex max-w-[65ch] flex-col gap-4 text-base leading-relaxed text-textPrimary md:text-lg">
            {profile.bio.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          <div className="card p-6 md:p-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">
              Education
            </h3>
            <p className="text-lg font-semibold text-textPrimary">
              {education.institution}{' '}
              <span className="text-sm font-normal text-textSecondary">({education.institutionShort})</span>
            </p>
            <p className="mt-0.5 text-sm text-textSecondary">{education.degree}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="text-xs uppercase tracking-wider text-textSecondary">{s.label}</dt>
                  <dd className="m-0 text-sm font-semibold text-textPrimary" title={s.title}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
