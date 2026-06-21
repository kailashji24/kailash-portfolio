// src/components/Hero.tsx
// Hero section — full-viewport landing panel with particle background layer.
//
// Layout layers (bottom → top):
//   z-index 0  — ParticleBackground (position: absolute, constrained to section)
//              — inner grain overlay (position: absolute, z-index: 0)
//   z-index 1  — Hero content (headline, typing animation, tagline, CTAs)
//
// The <section> carries position: relative so the absolutely-positioned
// ParticleBackground canvas is clipped to the Hero viewport rather than
// escaping to the full page.
//
// ── 4.8 Parallax scroll effects ─────────────────────────────────────────────
//   - particleLayerRef wrapper shifts at 0.3× scroll speed (translateY -0.3 × scrollY)
//   - grainLayerRef overlay shifts at 0.15× scroll speed (translateY -0.15 × scrollY)
//   - Both driven by a native window scroll listener throttled via requestAnimationFrame
//   - Both disabled (no transform applied) when reducedMotion === true

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTypingAnimation } from '../hooks/useTypingAnimation'
import VoyageMotifs from './VoyageMotifs'
import { TechGlyphs } from './TechGlyphs'
import { theme } from '../theme'
import { HERO_TAGLINE } from '../data/index'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import compassUrl from '../assets/svgs/compass.svg?url'

const HEADLINE = 'Kailash Chaudhary'

const ROLE_PHRASES = [
  'Cloud & DevOps Engineer',
  'Python Developer',
  'Backend Engineer',
  'AI/ML Builder',
]

interface HeroProps {
  reducedMotion: boolean
}

export function Hero({ reducedMotion }: HeroProps) {
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([])

  // ── 4.8 — Parallax layer refs (wired in task 4.8) ────────────────────────
  const particleLayerRef = useRef<HTMLDivElement | null>(null)
  const grainLayerRef    = useRef<HTMLDivElement | null>(null)
  void particleLayerRef
  void grainLayerRef
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // ── 4.7 — Scroll indicator ref ────────────────────────────────────────────
  const scrollIndicatorRef = useRef<HTMLButtonElement | null>(null)

  const { displayText, isTyping } = useTypingAnimation(ROLE_PHRASES, {
    typeSpeed: 80,
    deleteSpeed: 40,
    pauseDuration: 1800,
    reducedMotion,
  })

  // ── 4.2 — GSAP stagger-letter reveal for headline ────────────────────────
  useEffect(() => {
    if (reducedMotion) return

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[]
    if (letters.length === 0) return

    gsap.fromTo(
      letters,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: theme.motion.durationSlow / 1000, // 0.6 s
        stagger: 0.05,
        ease: theme.motion.ease,
      },
    )
  }, [reducedMotion])

  // ── 4.6 — GSAP ScrollTrigger hero pin + content fade ─────────────────────
  // Pins the <section> for 200px of scroll travel.
  // While pinned, the content layer fades to opacity 0.3 and shifts up 20px.
  // The particle canvas and grain overlay are NOT targeted — only contentRef.
  // Skipped entirely when reducedMotion === true.
  useEffect(() => {
    if (reducedMotion) return
    if (!sectionRef.current || !contentRef.current) return

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200',
      pin: true,
      scrub: true,
      animation: gsap.to(contentRef.current, {
        opacity: 0.3,
        y: -20,
        ease: 'none',
      }),
    })

    return () => {
      st.kill()
    }
  }, [reducedMotion])

  // ── 4.7 — GSAP ScrollTrigger scroll indicator fade ────────────────────────
  // Fades the scroll indicator from opacity 1 → 0 as the user scrolls
  // the first 100px of the page. Killed on unmount.
  useEffect(() => {
    if (!scrollIndicatorRef.current) return

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '+=100',
      scrub: true,
      animation: gsap.fromTo(
        scrollIndicatorRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'none' },
      ),
    })

    return () => {
      st.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-navy-deep)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Layer 0a: Sunset gradient wash + radial sun glow ─────────────────
          Sits behind particles (z-index -1 relative to section content).
          Vertical gradient: deep navy top → warm amber tint bottom.
          Radial glow: soft amber centered at 65% height to mimic a
          low sun horizon. Both are pointer-events: none, aria-hidden.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          // Vertical sunset gradient
          background: `
            linear-gradient(
              to bottom,
              rgba(10,20,40,0) 0%,
              rgba(10,20,40,0) 45%,
              rgba(58,42,31,0.45) 75%,
              rgba(42,28,12,0.6) 100%
            )
          `,
        }}
      />
      {/* Radial amber sun glow — separate layer so it can be centered precisely */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `radial-gradient(
            ellipse 70% 35% at 50% 72%,
            rgba(242,201,76,0.12) 0%,
            rgba(232,178,58,0.06) 45%,
            transparent 100%
          )`,
        }}
      />

      {/* ── Layer 0b: Tech glyph icons — cloud, terminal, db, container etc. ─
          Absolutely positioned, low opacity, slow CSS bob animations.
          Disabled under prefers-reduced-motion (handled inside TechGlyphs).
      */}
      <TechGlyphs reducedMotion={reducedMotion} />

      {/* ── VoyageMotifs — captain at wheel + sailboat, absolutely positioned ── */}
      <VoyageMotifs reducedMotion={reducedMotion} />

      {/* ── Content Layer (z-index: 1) ────────────────────────────────────── */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ── 4.2 — Display Headline ──────────────────────────────────────── */}
        {/*
          - Font: Cinzel (Google Fonts, imported in index.css)
          - Responsive size: text-4xl (mobile) → md:text-5xl → lg:text-7xl (≥3rem on desktop)
          - Color: #E8EDF2 via text-textPrimary Tailwind token
          - GSAP stagger-letter reveal on mount (skipped when reducedMotion === true)
          - aria-label on <h1> preserves accessible text; individual spans are aria-hidden
        */}
        <h1
          className="text-4xl md:text-5xl lg:text-7xl text-textPrimary text-center"
          style={{ fontFamily: theme.fonts.display }}
          aria-label={HEADLINE}
        >
          {HEADLINE.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => { lettersRef.current[i] = el }}
              style={
                reducedMotion
                  ? { opacity: 1, display: 'inline-block' }
                  : { display: 'inline-block' }
              }
              aria-hidden="true"
            >
              {/* Replace space with NBSP so inline-block spans don't collapse */}
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* ── Typing Animation — Role Titles ─────────────────────────────── */}
        <p
          aria-live="polite"
          aria-atomic="true"
          style={{
            color: theme.colors.gold.primary,
            fontFamily: theme.fonts.display,
            fontSize: '1.35rem',
            fontWeight: 400,
            letterSpacing: '0.04em',
            margin: '0.5rem 0 0',
            textAlign: 'center',
            minHeight: '2rem',
          }}
        >
          {displayText}
          {!reducedMotion && isTyping && (
            <span className="typing-cursor" aria-hidden="true">|</span>
          )}
        </p>

        {/* ── Tagline ─────────────────────────────────────────────────────── */}
        <p
          className="max-w-2xl"
          style={{
            color: theme.colors.text.secondary,
            fontFamily: theme.fonts.body,
            fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
            lineHeight: 1.6,
            margin: '1rem auto 0',
            textAlign: 'center',
          }}
        >
          {HERO_TAGLINE}
        </p>

        {/* ── CTA Buttons ─────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '2rem',
          }}
        >
          {/* "View Projects" — gold fill */}
          <button
            {...CURSOR_INTERACTIVE}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#E8B23A',
              color: '#0A1428',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 2rem',
              minWidth: '48px',
              minHeight: '48px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              cursor: 'pointer',
              transition: 'filter 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget
              btn.style.filter = 'brightness(1.15)'
              btn.style.boxShadow = '0 0 12px rgba(232, 178, 58, 0.6)'
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget
              btn.style.filter = ''
              btn.style.boxShadow = ''
            }}
          >
            View Projects
          </button>

          {/* "Get in Touch" — outlined */}
          <button
            {...CURSOR_INTERACTIVE}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: 'transparent',
              color: '#E8B23A',
              border: '2px solid #E8B23A',
              borderRadius: '4px',
              padding: '0.75rem 2rem',
              minWidth: '48px',
              minHeight: '48px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              cursor: 'pointer',
              transition: 'filter 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget
              btn.style.filter = 'brightness(1.15)'
              btn.style.boxShadow = '0 0 12px rgba(232, 178, 58, 0.45)'
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget
              btn.style.filter = ''
              btn.style.boxShadow = ''
            }}
          >
            Get in Touch
          </button>

          {/* "Download Resume" — outlined, triggers direct file download */}
          <a
            href="/resume.pdf"
            download
            {...CURSOR_INTERACTIVE}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'transparent',
              color: '#E8B23A',
              border: '2px solid #E8B23A',
              borderRadius: '4px',
              padding: '0.75rem 2rem',
              minHeight: '48px',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: theme.fonts.body,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'filter 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.filter = 'brightness(1.15)'
              el.style.boxShadow = '0 0 12px rgba(232, 178, 58, 0.45)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.filter = ''
              el.style.boxShadow = ''
            }}
          >
            {/* Simple download arrow icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 12L3 7h3V2h4v5h3L8 12z"/>
              <rect x="2" y="13" width="12" height="1.5" rx="0.75"/>
            </svg>
            Download Resume
          </a>
        </div>
      </div>

      {/* ── 4.7 — Scroll Indicator ────────────────────────────────────────── */}
      {/*
        - Compass SVG imported as a URL asset via Vite's ?url query
        - Absolutely positioned at bottom-center of the hero section
        - Bounces vertically with scrollBounce animation (skipped when reducedMotion)
        - Fades out as the user scrolls the first 100px (GSAP ScrollTrigger)
        - Clicking/tapping scrolls smoothly to #about
      */}
      <button
        ref={scrollIndicatorRef}
        aria-label="Scroll down"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        className={!reducedMotion ? 'scroll-indicator-bounce' : undefined}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'none',
          border: 'none',
          padding: '8px', // expands tap target to 48×48px (32px icon + 8px each side)
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <img
          src={compassUrl}
          width={32}
          height={32}
          aria-hidden="true"
          alt=""
        />
      </button>
    </section>
  )
}
