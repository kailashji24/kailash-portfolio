// src/components/Certs.tsx
// "The Marks" — certifications + publication. Documents open in a new tab
// (recruiters want to glance, not download).

import { useRef } from 'react'
import { certifications } from '../data/index'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import { SectionHeading } from './SectionHeading'

interface CertsProps {
  reducedMotion: boolean
}

const BADGE = {
  certification: { label: 'Certification', className: 'border-gold/40 bg-gold/15 text-gold' },
  publication: { label: 'Publication', className: 'border-oceanMid bg-ocean text-textPrimary' },
} as const

export function Certs({ reducedMotion }: CertsProps) {
  const gridRef = useRef<HTMLUListElement>(null)
  useScrollReveal(gridRef, { reducedMotion, stagger: 0.1 })

  return (
    <section
      id="certs"
      aria-labelledby="certs-title"
      className="section"
      style={{ backgroundColor: 'var(--bg-navy-mid)' }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="Certifications & Publication" title="The Marks" id="certs-title" />

        <ul ref={gridRef} className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
          {certifications.map((cert) => {
            const badge = BADGE[cert.type]
            return (
              <li key={cert.id} className="card flex flex-col gap-3 p-6">
                <span className={`self-start rounded-full border px-3 py-1 text-xs font-semibold ${badge.className}`}>
                  {badge.label}
                </span>

                <h3 className="font-display text-base font-bold leading-snug text-textPrimary">{cert.title}</h3>
                <p className="m-0 text-sm text-textSecondary">
                  {cert.issuer} · {cert.date}
                </p>

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...CURSOR_INTERACTIVE}
                    className="link-gold mt-auto self-start text-sm"
                    aria-label={`View ${cert.type === 'publication' ? 'paper' : 'certificate'}: ${cert.title} (PDF, opens in a new tab)`}
                  >
                    {cert.type === 'publication' ? 'Read the paper' : 'View certificate'}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M4.5 2H10v5.5M10 2L3 9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
