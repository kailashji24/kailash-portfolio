// src/components/Hero.tsx
// Full-viewport landing panel: name, role, one-line pitch, three CTAs.
//
// Layers (bottom → top): sunset gradient + sun glow → tech glyphs →
// voyage line-art → content. The role is static text (one clear identity);
// secondary strengths sit underneath in smaller type.

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import VoyageMotifs from './VoyageMotifs'
import { TechGlyphs } from './TechGlyphs'
import { theme } from '../theme'
import { profile } from '../data/index'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import compassUrl from '../assets/svgs/compass.svg?url'

interface HeroProps {
  reducedMotion: boolean
}

export function Hero({ reducedMotion }: HeroProps) {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const restRef = useRef<HTMLDivElement>(null)

  // Entrance: headline letters stagger in, then the rest fades up.
  // Layout effect so the hidden start state is applied before first paint.
  useLayoutEffect(() => {
    if (reducedMotion) return
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[]
    const rest = restRef.current ? Array.from(restRef.current.children) : []

    const tl = gsap.timeline({ defaults: { ease: theme.motion.ease } })
    tl.fromTo(letters, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 })
    tl.fromTo(rest, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')

    return () => {
      tl.kill()
      gsap.set([...letters, ...rest], { clearProps: 'opacity,transform' })
    }
  }, [reducedMotion])

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-24"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
    >
      {/* Sunset wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,20,40,0) 0%, rgba(10,20,40,0) 45%, rgba(58,42,31,0.45) 75%, rgba(42,28,12,0.6) 100%)',
        }}
      />
      {/* Low sun glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 35% at 50% 72%, rgba(242,201,76,0.12) 0%, rgba(232,178,58,0.06) 45%, transparent 100%)',
        }}
      />

      <TechGlyphs reducedMotion={reducedMotion} />
      <VoyageMotifs reducedMotion={reducedMotion} />

      <div className="relative z-[1] flex max-w-3xl flex-col items-center text-center">
        <h1
          className="font-display text-[2.5rem] leading-tight text-textPrimary sm:text-5xl lg:text-7xl"
          aria-label={profile.name}
        >
          {/* Letters are wrapped per word so the name never breaks mid-word on phones */}
          {profile.name.split(' ').map((word, w, words) => {
            const offset = words.slice(0, w).join(' ').length + (w > 0 ? 1 : 0)
            return (
              <span key={word} className="inline-block whitespace-nowrap" aria-hidden="true">
                {word.split('').map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => {
                      lettersRef.current[offset + i] = el
                    }}
                    className="inline-block"
                  >
                    {char}
                  </span>
                ))}
                {w < words.length - 1 && '\u00A0'}
              </span>
            )
          })}
        </h1>

        <div ref={restRef} className="flex flex-col items-center">
          <p className="mt-3 font-display text-xl tracking-wide text-gold sm:text-2xl">
            {profile.role}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-textSecondary">
            {profile.secondaryRoles}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-textSecondary sm:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a href="#projects" {...CURSOR_INTERACTIVE} className="btn-primary">
              View Projects
            </a>
            <a href="#contact" {...CURSOR_INTERACTIVE} className="btn-outline">
              Get in Touch
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...CURSOR_INTERACTIVE}
              className="btn-outline"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 12L3 7h3V2h4v5h3L8 12z" />
                <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
              </svg>
              Resume
            </a>
          </div>

          <p className="mt-6 text-sm text-textSecondary">
            <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-gold align-middle" />
            {profile.availability}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to About"
        {...CURSOR_INTERACTIVE}
        className={`absolute bottom-6 left-1/2 z-[2] -translate-x-1/2 p-2 ${
          reducedMotion ? '' : 'scroll-indicator-bounce'
        }`}
      >
        <img src={compassUrl} width={32} height={32} alt="" aria-hidden="true" />
      </a>
    </section>
  )
}
