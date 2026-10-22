// src/hooks/useScrollReveal.ts
// GSAP ScrollTrigger scroll-reveal hook.
// Fades + slides up the direct children of the container when it enters the
// viewport. Under reduced motion the children are simply shown.

import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// The only registration of the plugin in the app.
gsap.registerPlugin(ScrollTrigger)

export interface ScrollRevealOptions {
  /** Y-offset to start from (px). Default: 30 */
  y?: number
  /** Stagger delay between children (seconds). Default: 0.1 */
  stagger?: number
  /** ScrollTrigger start position. Default: 'top 85%' */
  start?: string
  /** Animation duration (seconds). Default: 0.6 */
  duration?: number
  /** Whether reduced motion is active — skips the animation entirely */
  reducedMotion?: boolean
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {},
): void {
  const { y = 30, stagger = 0.1, start = 'top 85%', duration = 0.6, reducedMotion = false } = options

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = Array.from(container.children) as HTMLElement[]
    if (children.length === 0) return

    if (reducedMotion) {
      gsap.set(children, { opacity: 1, y: 0 })
      return
    }

    gsap.set(children, { opacity: 0, y })

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start,
        once: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      // Leave content visible if the component re-renders mid-animation
      gsap.set(children, { clearProps: 'opacity,transform' })
    }
  }, [ref, y, stagger, start, duration, reducedMotion])
}
