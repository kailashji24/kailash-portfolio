// src/App.tsx
// Portfolio root shell — global overlays, navigation and page sections.
//
// Layer order (bottom → top):
//   z 0   — ParticleBackground canvas (fixed)
//   z 1   — <main> page content (sections use semi-transparent backgrounds)
//   z 2   — grain overlay (fixed, pointer-events: none)
//   z 40  — Navbar (fixed)
//   z 9998+ — CustomCursor

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useReducedMotion } from './hooks/useReducedMotion'
import { CustomCursor } from './components/CustomCursor'
import ParticleBackground from './components/ParticleBackground'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Certs } from './components/Certs'
import { Contact } from './components/Contact'

function App() {
  const reducedMotion = useReducedMotion()

  // Web fonts change text metrics after first paint — recompute trigger
  // positions once they are ready so reveals fire at the right scroll offset.
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-navy">
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-3 z-50 rounded bg-gold px-4 py-2 font-semibold text-navy"
      >
        Skip to content
      </a>

      <ParticleBackground reducedMotion={reducedMotion} />
      <div className="grain-overlay" aria-hidden="true" />
      <CustomCursor reducedMotion={reducedMotion} />
      <Navbar />

      <main id="main" tabIndex={-1} className="relative z-[1] outline-none">
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
