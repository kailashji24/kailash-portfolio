/**
 * @file CustomCursor.tsx
 *
 * Renders a gold dot + lagging outer ring that follow the pointer on fine-pointer
 * (mouse) devices. On touch / coarse-pointer devices this component renders null.
 *
 * Interactive element protocol
 * ----------------------------
 * Add the attribute `data-cursor="interactive"` to any link, button, or card
 * element to opt it into the cursor hover effect (ring scales to 2.5× and fills
 * gold on mouseenter, returns to normal on mouseleave).
 *
 * Use the `CURSOR_INTERACTIVE` helper from `src/utils/cursorInteractive.ts`:
 *   import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
 *   <a href="#about" {...CURSOR_INTERACTIVE}>About Me</a>
 *
 * NOTE: The correct attribute is `data-cursor="interactive"` — NOT
 * `data-cursor-expand` (which appears in some early requirement drafts but is
 * NOT what this component listens for).
 */
// src/components/CustomCursor.tsx
import { useEffect, useRef, useState } from 'react'

const GOLD = '#E8B23A'

// Lerp factor that yields ~80ms effective lag at 60 fps:
//   time_constant ≈ -frameTime / ln(1 - factor)
//   at factor=0.12, 60fps: ~15.4ms per frame → τ ≈ 79ms
const LERP_FACTOR = 0.12

interface CustomCursorProps {
  reducedMotion: boolean
}

export function CustomCursor({ reducedMotion }: CustomCursorProps) {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number>(0)

  // Positions tracked in refs (not state) to avoid re-renders on every mousemove
  const ringPos  = useRef({ x: 0, y: 0 })
  const targetPos = useRef({ x: 0, y: 0 })

  // Scale factor for the ring — mutated by enter/leave handlers, read by RAF loop
  const ringScale = useRef(1)

  // Whether ring is in "hover" state — used only to set initial CSS on mount
  const [isHovering, setIsHovering] = useState(false)

  // Detect fine pointer capability once on mount.
  // window.matchMedia('(pointer: fine)') covers all mouse-driven devices.
  // Returns false for touch screens, tablets, and stylus-only devices (pointer: coarse / none)
  // regardless of screen size — no viewport-width check, no user-agent sniffing.
  const [hasFinePointer] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: fine)').matches
      : false
  )

  useEffect(() => {
    if (!hasFinePointer || reducedMotion) return

    // Hide the native cursor while the custom cursor is active
    document.body.classList.add('cursor-active')

    // ── Dot: instant position update ──────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY }

      if (dotRef.current) {
        // Dot is 4×4 px — offset by 2px to center it on the pointer
        dotRef.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`
      }
    }

    // ── Ring: lerp via RAF ─────────────────────────────────────────────────────
    const animateRing = () => {
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * LERP_FACTOR
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * LERP_FACTOR

      if (ringRef.current) {
        // Ring is 20×20 px — offset by 10px to center it; then apply scale
        // Combine translate + scale in a single transform string so they don't
        // conflict with the React style prop (which we deliberately leave empty
        // for transform on ringRef).
        const x = ringPos.current.x - 10
        const y = ringPos.current.y - 10
        const s = ringScale.current
        ringRef.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`
      }

      rafRef.current = requestAnimationFrame(animateRing)
    }
    rafRef.current = requestAnimationFrame(animateRing)

    // ── Interactive element detection ──────────────────────────────────────────
    // Attach mouseenter/mouseleave to all [data-cursor="interactive"] elements
    // present in the DOM at mount time, and re-scan if the DOM changes via
    // a MutationObserver so late-mounted sections are also covered.

    const applyListeners = (root: Document | Element) => {
      const els = root.querySelectorAll<HTMLElement>('[data-cursor="interactive"]')
      els.forEach(el => {
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    }

    const removeListeners = (root: Document | Element) => {
      const els = root.querySelectorAll<HTMLElement>('[data-cursor="interactive"]')
      els.forEach(el => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }

    const handleEnter = () => {
      ringScale.current = 2.5
      setIsHovering(true)
    }

    const handleLeave = () => {
      ringScale.current = 1
      setIsHovering(false)
    }

    applyListeners(document)

    // Watch for new [data-cursor="interactive"] nodes added after initial mount
    const observer = new MutationObserver(() => {
      // Remove stale listeners then re-apply to all matching elements
      removeListeners(document)
      applyListeners(document)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.body.classList.remove('cursor-active')
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      removeListeners(document)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFinePointer, reducedMotion])

  // No custom cursor on coarse/none pointer devices or when reduced motion is on
  if (!hasFinePointer || reducedMotion) return null

  return (
    <>
      {/* ── Gold dot — 4px, follows cursor instantly with no lag ────────────── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: GOLD,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          // Start off-screen until first mousemove so it doesn't flash at (0,0)
          transform: 'translate(-100px, -100px)',
        }}
      />

      {/* ── Ring — ~20px outline, lerp-lags; scales to 2.5× + fills on hover ── */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${GOLD}`,
          // Fill gold on hover; transparent otherwise
          backgroundColor: isHovering ? GOLD : 'transparent',
          // CSS transition for the fill colour change (scale is driven by RAF)
          transition: 'background-color 180ms ease-out',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          // Start off-screen until first mousemove
          transform: 'translate(-100px, -100px)',
        }}
      />
    </>
  )
}
