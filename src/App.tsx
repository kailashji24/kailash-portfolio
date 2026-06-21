// src/App.tsx
// Portfolio root shell — composes global overlays and section components.
//
// Layer order (bottom → top):
//   z-index 0  — ParticleBackground canvas (position: fixed)
//   z-index 2  — grain-overlay div (position: fixed, mix-blend-mode: screen)
//   z-index 1  — <main> page content (sections use semi-transparent bg tokens)
//   z-index 50 — CustomCursor

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useReducedMotion } from './hooks/useReducedMotion'
import { CustomCursor } from './components/CustomCursor'
import ParticleBackground from './components/ParticleBackground'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Certs } from './components/Certs'
import { Contact } from './components/Contact'

import './App.css'

function App() {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#0A1428' }}>

      {/* ── z-index 0 — Persistent particle canvas behind every section ── */}
      <ParticleBackground reducedMotion={reducedMotion} />

      {/* ── z-index 2 — Grain / parchment texture overlay ──────────────── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Fixed cursor overlay ────────────────────────────────────────── */}
      <CustomCursor reducedMotion={reducedMotion} />

      {/* ── z-index 1 — Page sections ───────────────────────────────────── */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero reducedMotion={reducedMotion} />
        <About reducedMotion={reducedMotion} />
        <Skills reducedMotion={reducedMotion} />
        <Projects reducedMotion={reducedMotion} />
        <Experience reducedMotion={reducedMotion} />
        <Certs reducedMotion={reducedMotion} />
        <Contact reducedMotion={reducedMotion} />
      </main>
    </div>
  )
}

export default App
