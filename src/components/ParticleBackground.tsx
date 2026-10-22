import { useEffect, useRef } from 'react'

/**
 * ParticleBackground
 * ------------------
 * Fixed full-viewport canvas of drifting gold motes behind every section.
 *
 * Performance notes:
 *   - Scaled by devicePixelRatio (capped at 2) so motes stay crisp on Retina/phones
 *   - The glow is pre-rendered once into a sprite; each frame is just drawImage
 *     (no per-particle shadowBlur, which is expensive)
 *   - Particles are regenerated only when the WIDTH changes, so the mobile URL
 *     bar showing/hiding (height-only resize) doesn't make them jump
 *   - Pauses while the tab is hidden
 */

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  baseOpacity: number
  flicker: number
}

interface ParticleBackgroundProps {
  reducedMotion: boolean
  /** Particles per 100,000 CSS px² of viewport. Default 1.4 */
  density?: number
}

const GOLD = '232, 178, 58'

function makeSprite(): HTMLCanvasElement {
  const size = 32
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = size
  const g = sprite.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, `rgba(${GOLD}, 1)`)
    grad.addColorStop(0.25, `rgba(${GOLD}, 0.85)`)
    grad.addColorStop(0.5, `rgba(${GOLD}, 0.25)`)
    grad.addColorStop(1, `rgba(${GOLD}, 0)`)
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
  }
  return sprite
}

export default function ParticleBackground({ reducedMotion, density = 1.4 }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const sprite = makeSprite()
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let raf = 0

    const seed = () => {
      const count = Math.max(24, Math.floor(((width * height) / 100000) * density))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 6, // sprite draw size in CSS px (glow included)
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: -0.05 - Math.random() * 0.18,
        baseOpacity: 0.25 + Math.random() * 0.5,
        flicker: Math.random() * Math.PI * 2,
      }))
    }

    const resize = () => {
      const newWidth = window.innerWidth
      const widthChanged = newWidth !== width
      width = newWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (widthChanged || particles.length === 0) seed()
      if (reducedMotion) draw(false)
    }

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        if (animate) {
          p.x += p.speedX
          p.y += p.speedY
          p.flicker += 0.02
          if (p.y < -10) {
            p.y = height + 10
            p.x = Math.random() * width
          }
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
        }
        const alpha = animate ? p.baseOpacity * (0.7 + 0.3 * Math.sin(p.flicker)) : p.baseOpacity * 0.6
        ctx.globalAlpha = alpha
        ctx.drawImage(sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
    }

    const loop = () => {
      draw(true)
      raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reducedMotion) raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)

    if (!reducedMotion) {
      raf = requestAnimationFrame(loop)
      document.addEventListener('visibilitychange', onVisibility)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reducedMotion, density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    />
  )
}
