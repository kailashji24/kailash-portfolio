/**
 * CustomCursor — gold dot + lagging ring for fine-pointer (mouse) devices.
 *
 * - Renders nothing on touch devices or under prefers-reduced-motion.
 * - Stays hidden until the first mouse move (no stray ring in the corner).
 * - Hover detection uses ONE delegated pointerover/pointerout listener on the
 *   document, so it costs nothing when the DOM changes.
 * - On interactive elements the ring grows and gets a faint gold tint, so the
 *   label underneath stays readable.
 *
 * Opt an element in with `data-cursor="interactive"` (see utils/cursorInteractive).
 * Links, buttons and form fields are picked up automatically too.
 */
import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTOR = '[data-cursor="interactive"], a, button, input, textarea, select, label'

// Lerp factor ≈ 80ms of lag at 60fps
const LERP_FACTOR = 0.18

interface CustomCursorProps {
  reducedMotion: boolean
}

export function CustomCursor({ reducedMotion }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const [hasFinePointer] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false,
  )

  const enabled = hasFinePointer && !reducedMotion

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let raf = 0
    let visible = false
    let hovering = false
    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }

    const show = (on: boolean) => {
      visible = on
      dot.style.opacity = on ? '1' : '0'
      ring.style.opacity = on ? '1' : '0'
    }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        // Snap the ring to the pointer on first appearance
        pos.x = target.x
        pos.y = target.y
        show(true)
        document.body.classList.add('cursor-active')
      }
      dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`
    }

    const tick = () => {
      pos.x += (target.x - pos.x) * LERP_FACTOR
      pos.y += (target.y - pos.y) * LERP_FACTOR
      const scale = hovering ? 2 : 1
      ring.style.transform = `translate(${pos.x - 14}px, ${pos.y - 14}px) scale(${scale})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const setHover = (on: boolean) => {
      if (on === hovering) return
      hovering = on
      ring.style.backgroundColor = on ? 'rgba(232, 178, 58, 0.15)' : 'transparent'
      ring.style.borderColor = on ? 'rgba(242, 201, 76, 0.9)' : 'rgba(232, 178, 58, 0.8)'
    }

    const onOver = (e: Event) => {
      const el = e.target as Element | null
      setHover(Boolean(el?.closest?.(INTERACTIVE_SELECTOR)))
    }

    const onLeaveWindow = () => show(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      document.body.classList.remove('cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  const base = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    borderRadius: '50%',
    pointerEvents: 'none' as const,
    opacity: 0,
    willChange: 'transform',
  }

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ ...base, width: 6, height: 6, backgroundColor: '#E8B23A', zIndex: 9999 }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 28,
          height: 28,
          border: '1.5px solid rgba(232, 178, 58, 0.8)',
          zIndex: 9998,
          transition: 'background-color 180ms ease-out, border-color 180ms ease-out, opacity 200ms ease',
        }}
      />
    </>
  )
}
