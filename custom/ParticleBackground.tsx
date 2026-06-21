import { useEffect, useRef } from 'react';

/**
 * ParticleBackground
 * -------------------
 * Mounts ONCE at the App root (not inside Hero) as a fixed full-viewport
 * layer behind every section. Sections must use semi-transparent
 * backgrounds (rgba, not solid hex) for this to be visible through them.
 *
 * Usage in App.tsx:
 *   <ParticleBackground reducedMotion={reducedMotion} />
 *   <main style={{ position: 'relative', zIndex: 1 }}>...</main>
 *
 * The canvas sits at position: fixed, z-index: 0, so it stays in place
 * while content scrolls over it.
 */

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  flicker: number;
}

interface ParticleBackgroundProps {
  reducedMotion: boolean;
  /** Particle density per 100,000px^2 of viewport. Default 1.4 */
  density?: number;
}

export default function ParticleBackground({
  reducedMotion,
  density = 1.4,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const scrollOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const area = width * height;
      const count = Math.max(24, Math.floor((area / 100000) * density));

      particlesRef.current = Array.from({ length: count }, () => {
        const baseOpacity = 0.25 + Math.random() * 0.5;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.6 + Math.random() * 1.8,
          speedX: (Math.random() - 0.5) * 0.12,
          speedY: -0.05 - Math.random() * 0.18,
          opacity: baseOpacity,
          baseOpacity,
          flicker: Math.random() * Math.PI * 2,
        };
      });
    };

    resize();
    window.addEventListener('resize', resize);

    if (reducedMotion) {
      // Static single frame: draw particles once, no animation loop.
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 178, 58, ${p.baseOpacity * 0.6})`;
        ctx.fill();
      });
      return () => window.removeEventListener('resize', resize);
    }

    const onScroll = () => {
      scrollOffsetRef.current = window.scrollY * 0.3; // parallax: 0.3x scroll speed
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let frame = 0;

    const animate = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.flicker += 0.02;
        p.opacity = p.baseOpacity * (0.7 + 0.3 * Math.sin(p.flicker));

        // wrap around edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const drawY = p.y; // canvas itself is fixed; parallax handled via translate on wrapper
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 178, 58, ${p.opacity})`;
        ctx.shadowColor = 'rgba(232, 178, 58, 0.6)';
        ctx.shadowBlur = p.radius * 2;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
