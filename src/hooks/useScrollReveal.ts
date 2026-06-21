// src/hooks/useScrollReveal.ts
// GSAP ScrollTrigger scroll-reveal hook.
// Animates direct children of the container ref with a fade + upward slide
// when the container enters the viewport.
// Respects prefers-reduced-motion: skips transform, uses opacity-only fade.

import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollRevealOptions {
  /** Y-offset to start from (px). Default: 30 */
  y?: number
  /** Stagger delay between children (seconds). Default: 0.1 */
  stagger?: number
  /** ScrollTrigger start position. Default: 'top 80%' */
  start?: string
  /** Animation duration (seconds). Default: 0.6 */
  duration?: number
  /** Whether reduced motion is active — disables y transform if true */
  reducedMotion?: boolean
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {}
): void {
  const {
    y = 30,
    stagger = 0.1,
    start = 'top 80%',
    duration = 0.6,
    reducedMotion = false,
  } = options

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]
    if (children.length === 0) return

    let tween: gsap.core.Tween

    if (reducedMotion) {
      // Immediately show all children with no transform
      gsap.set(children, { opacity: 1, y: 0 })
      return
    }

    // Set initial state explicitly so elements are hidden before animation
    gsap.set(children, { opacity: 0, y })

    // Animate from hidden + offset to visible
    tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start,
        once: true,
        // toggleActions ensures the animation plays even if the section is
        // already partially in view when the page loads
        toggleActions: 'play none none none',
      },
    })

    // Cleanup: kill the ScrollTrigger on unmount to prevent memory leaks
    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [ref, y, stagger, start, duration, reducedMotion])
}
