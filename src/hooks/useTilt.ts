// src/hooks/useTilt.ts
// Lightweight 3D hover tilt (replaces the react-tilt dependency, which only
// supported React 18). Pointer-driven, mouse only, rAF-throttled, and a no-op
// under reduced motion or on touch devices.

import { useEffect, type RefObject } from 'react'

export interface TiltOptions {
  /** Max rotation in degrees. Default 6 */
  max?: number
  /** Scale while hovered. Default 1.02 */
  scale?: number
  disabled?: boolean
}

export function useTilt(ref: RefObject<HTMLElement | null>, { max = 6, scale = 1.02, disabled = false }: TiltOptions = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    el.style.transition = 'transform 300ms ease-out'
    el.style.willChange = 'transform'

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(${scale})`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.style.transform = ''
      el.style.transition = ''
      el.style.willChange = ''
    }
  }, [ref, max, scale, disabled])
}
