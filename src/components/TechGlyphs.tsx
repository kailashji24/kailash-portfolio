// src/components/TechGlyphs.tsx
// Decorative tech-glyph layer for the Hero section.
// Renders 6 large, slow-drifting outlined icon SVGs (cloud, terminal brackets,
// database, container, circuit, brackets) at low opacity (10-15%).
// Each glyph bobs at a slightly different speed/phase via CSS animations.
// All animations disabled under prefers-reduced-motion.
// aria-hidden — purely decorative.

interface TechGlyphsProps {
  reducedMotion: boolean
}

// ── Glyph definitions ───────────────────────────────────────────────────────
// Each has: the SVG path(s), a viewBox, position (% from top/left/right),
// size (px), opacity, and a unique animation duration + delay.

interface GlyphDef {
  id: string
  viewBox: string
  paths: React.ReactNode
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  opacity: number
  duration: number  // seconds
  delay: number     // seconds
}

const GLYPHS: GlyphDef[] = [
  // ── Cloud ──────────────────────────────────────────────────────────────────
  {
    id: 'cloud',
    viewBox: '0 0 48 32',
    paths: (
      <path
        d="M38 28H12a10 10 0 0 1-1-19.95A12 12 0 0 1 35 12h3a8 8 0 0 1 0 16z"
        stroke="#E8B23A" strokeWidth="1.5" fill="none" strokeLinejoin="round"
      />
    ),
    top: '12%',
    left: '8%',
    size: 72,
    opacity: 0.13,
    duration: 9,
    delay: 0,
  },
  // ── Terminal / code brackets < /> ──────────────────────────────────────────
  {
    id: 'terminal',
    viewBox: '0 0 48 48',
    paths: (
      <>
        <polyline points="14,16 6,24 14,32" stroke="#E8B23A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="34,16 42,24 34,32" stroke="#E8B23A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="28" y1="12" x2="20" y2="36" stroke="#E8B23A" strokeWidth="1.5" strokeLinecap="round"/>
      </>
    ),
    top: '20%',
    right: '10%',
    size: 68,
    opacity: 0.12,
    duration: 11,
    delay: 1.5,
  },
  // ── Database cylinder ──────────────────────────────────────────────────────
  {
    id: 'database',
    viewBox: '0 0 40 52',
    paths: (
      <>
        <ellipse cx="20" cy="10" rx="16" ry="6" stroke="#E8B23A" strokeWidth="1.5" fill="none"/>
        <line x1="4" y1="10" x2="4" y2="42" stroke="#E8B23A" strokeWidth="1.5"/>
        <line x1="36" y1="10" x2="36" y2="42" stroke="#E8B23A" strokeWidth="1.5"/>
        <ellipse cx="20" cy="42" rx="16" ry="6" stroke="#E8B23A" strokeWidth="1.5" fill="none"/>
        <path d="M4 26 Q20 31 36 26" stroke="#E8B23A" strokeWidth="1.2" fill="none" strokeDasharray="3 2"/>
      </>
    ),
    bottom: '28%',
    left: '5%',
    size: 56,
    opacity: 0.11,
    duration: 13,
    delay: 3,
  },
  // ── Container / cube box ───────────────────────────────────────────────────
  {
    id: 'container',
    viewBox: '0 0 48 48',
    paths: (
      <>
        {/* Front face */}
        <rect x="8" y="16" width="28" height="24" rx="2" stroke="#E8B23A" strokeWidth="1.5" fill="none"/>
        {/* Top face */}
        <polyline points="8,16 16,8 44,8 44,24 36,32" stroke="#E8B23A" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        {/* Right edge top */}
        <line x1="44" y1="8" x2="36" y2="16" stroke="#E8B23A" strokeWidth="1.5"/>
        {/* Horizontal stripe on front */}
        <line x1="8" y1="26" x2="36" y2="26" stroke="#E8B23A" strokeWidth="1" strokeDasharray="4 3" opacity="0.7"/>
      </>
    ),
    top: '55%',
    right: '7%',
    size: 64,
    opacity: 0.12,
    duration: 10,
    delay: 2,
  },
  // ── Circuit node / chip ────────────────────────────────────────────────────
  {
    id: 'circuit',
    viewBox: '0 0 48 48',
    paths: (
      <>
        {/* Central square chip */}
        <rect x="14" y="14" width="20" height="20" rx="3" stroke="#E8B23A" strokeWidth="1.5" fill="none"/>
        {/* Pins left */}
        <line x1="4" y1="20" x2="14" y2="20" stroke="#E8B23A" strokeWidth="1.2"/>
        <line x1="4" y1="28" x2="14" y2="28" stroke="#E8B23A" strokeWidth="1.2"/>
        {/* Pins right */}
        <line x1="34" y1="20" x2="44" y2="20" stroke="#E8B23A" strokeWidth="1.2"/>
        <line x1="34" y1="28" x2="44" y2="28" stroke="#E8B23A" strokeWidth="1.2"/>
        {/* Pins top */}
        <line x1="20" y1="4" x2="20" y2="14" stroke="#E8B23A" strokeWidth="1.2"/>
        <line x1="28" y1="4" x2="28" y2="14" stroke="#E8B23A" strokeWidth="1.2"/>
        {/* Pins bottom */}
        <line x1="20" y1="34" x2="20" y2="44" stroke="#E8B23A" strokeWidth="1.2"/>
        <line x1="28" y1="34" x2="28" y2="44" stroke="#E8B23A" strokeWidth="1.2"/>
        {/* Inner dot */}
        <circle cx="24" cy="24" r="3" stroke="#E8B23A" strokeWidth="1.2" fill="none"/>
      </>
    ),
    top: '8%',
    right: '30%',
    size: 58,
    opacity: 0.10,
    duration: 14,
    delay: 4,
  },
  // ── Curly braces { } ──────────────────────────────────────────────────────
  {
    id: 'braces',
    viewBox: '0 0 48 48',
    paths: (
      <>
        {/* Left brace */}
        <path
          d="M22 6 Q14 6 14 14 L14 20 Q14 24 10 24 Q14 24 14 28 L14 34 Q14 42 22 42"
          stroke="#E8B23A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* Right brace */}
        <path
          d="M26 6 Q34 6 34 14 L34 20 Q34 24 38 24 Q34 24 34 28 L34 34 Q34 42 26 42"
          stroke="#E8B23A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
      </>
    ),
    bottom: '15%',
    right: '22%',
    size: 60,
    opacity: 0.11,
    duration: 12,
    delay: 0.8,
  },
]

// ── CSS keyframes (injected once) ───────────────────────────────────────────
const GLYPH_STYLES = `
  @keyframes glyph-bob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  .tech-glyph {
    animation: glyph-bob var(--glyph-dur, 10s) ease-in-out infinite;
    animation-delay: var(--glyph-delay, 0s);
  }
  @media (prefers-reduced-motion: reduce) {
    .tech-glyph { animation: none !important; }
  }
`

// ── Component ───────────────────────────────────────────────────────────────

export function TechGlyphs({ reducedMotion }: TechGlyphsProps) {
  return (
    <>
      <style>{GLYPH_STYLES}</style>
      {GLYPHS.map((g) => (
        <div
          key={g.id}
          aria-hidden="true"
          className={reducedMotion ? undefined : 'tech-glyph'}
          style={{
            position: 'absolute',
            top: g.top,
            bottom: g.bottom,
            left: g.left,
            right: g.right,
            width: g.size,
            height: g.size,
            opacity: g.opacity,
            pointerEvents: 'none',
            zIndex: 0,
            // CSS custom props for per-glyph animation timing
            ['--glyph-dur' as string]: `${g.duration}s`,
            ['--glyph-delay' as string]: `${g.delay}s`,
          }}
        >
          <svg
            viewBox={g.viewBox}
            width={g.size}
            height={g.size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {g.paths}
          </svg>
        </div>
      ))}
    </>
  )
}
