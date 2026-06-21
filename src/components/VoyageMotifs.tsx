import { useEffect, useRef } from 'react';

/**
 * VoyageMotifs
 * ------------
 * Original line-art silhouettes (NOT licensed IP): a captain at a ship's
 * wheel, and a small sailboat. Rendered as low-opacity SVGs positioned
 * absolutely within the Hero section. Includes a slow idle sway animation
 * via CSS, disabled under prefers-reduced-motion.
 *
 * Usage: place inside Hero.tsx, as a sibling to the headline content,
 * with the Hero section itself set to position: relative.
 *
 *   <section style={{ position: 'relative' }}>
 *     <VoyageMotifs reducedMotion={reducedMotion} />
 *     ...hero content...
 *   </section>
 */

interface VoyageMotifsProps {
  reducedMotion: boolean;
}

export default function VoyageMotifs({ reducedMotion }: VoyageMotifsProps) {
  const captainRef = useRef<HTMLDivElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const captain = captainRef.current;
    const boat = boatRef.current;
    if (!captain || !boat) return;

    // CSS animations handle the loop; this effect just ensures
    // animation-play-state is running (defensive, no-op if already set).
    captain.style.animationPlayState = 'running';
    boat.style.animationPlayState = 'running';
  }, [reducedMotion]);

  return (
    <>
      <style>
        {`
          @keyframes voyage-sway {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(0.5deg); }
          }
          @keyframes voyage-drift {
            0% { transform: translateX(0px); }
            100% { transform: translateX(40px); }
          }
          .voyage-captain {
            animation: voyage-sway 6s ease-in-out infinite;
          }
          .voyage-boat {
            animation: voyage-drift 14s ease-in-out infinite alternate;
          }
          @media (prefers-reduced-motion: reduce) {
            .voyage-captain, .voyage-boat {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* Captain at the wheel — bottom right */}
      <div
        ref={captainRef}
        className={reducedMotion ? '' : 'voyage-captain'}
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '4%',
          bottom: '4%',
          width: 'clamp(140px, 18vw, 220px)',
          opacity: 0.22,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* ship's wheel */}
          <circle cx="100" cy="90" r="62" stroke="#E8B23A" strokeWidth="2" />
          <circle cx="100" cy="90" r="46" stroke="#E8B23A" strokeWidth="1.5" />
          <circle cx="100" cy="90" r="8" stroke="#E8B23A" strokeWidth="2" />
          {/* spokes */}
          <line x1="100" y1="28" x2="100" y2="44" stroke="#E8B23A" strokeWidth="2" />
          <line x1="100" y1="136" x2="100" y2="152" stroke="#E8B23A" strokeWidth="2" />
          <line x1="38" y1="90" x2="54" y2="90" stroke="#E8B23A" strokeWidth="2" />
          <line x1="146" y1="90" x2="162" y2="90" stroke="#E8B23A" strokeWidth="2" />
          <line x1="56" y1="46" x2="68" y2="58" stroke="#E8B23A" strokeWidth="2" />
          <line x1="132" y1="122" x2="144" y2="134" stroke="#E8B23A" strokeWidth="2" />
          <line x1="144" y1="46" x2="132" y2="58" stroke="#E8B23A" strokeWidth="2" />
          <line x1="68" y1="122" x2="56" y2="134" stroke="#E8B23A" strokeWidth="2" />
          {/* handles at spoke ends */}
          <circle cx="100" cy="28" r="4" fill="#E8B23A" />
          <circle cx="100" cy="152" r="4" fill="#E8B23A" />
          <circle cx="38" cy="90" r="4" fill="#E8B23A" />
          <circle cx="162" cy="90" r="4" fill="#E8B23A" />
          <circle cx="56" cy="46" r="4" fill="#E8B23A" />
          <circle cx="144" cy="134" r="4" fill="#E8B23A" />
          <circle cx="144" cy="46" r="4" fill="#E8B23A" />
          <circle cx="56" cy="134" r="4" fill="#E8B23A" />

          {/* figure silhouette, standing below the wheel */}
          <path
            d="M100 154
               C 92 154 86 162 86 172
               L 84 224
               L 92 224
               L 96 186
               L 100 224
               L 96 230
               L 104 230
               L 100 224
               L 104 186
               L 108 224
               L 116 224
               L 114 172
               C 114 162 108 154 100 154 Z"
            fill="#E8B23A"
            opacity="0.9"
          />
          {/* head */}
          <circle cx="100" cy="142" r="9" fill="#E8B23A" />
        </svg>
      </div>

      {/* Sailboat — bottom left */}
      <div
        ref={boatRef}
        className={reducedMotion ? '' : 'voyage-boat'}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '2%',
          bottom: '3%',
          width: 'clamp(110px, 14vw, 180px)',
          opacity: 0.18,
          pointerEvents: 'none',
        }}
      >
        <svg viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* hull */}
          <path
            d="M30 110 L190 110 L168 128 L52 128 Z"
            stroke="#E8B23A"
            strokeWidth="1.5"
          />
          {/* mast */}
          <line x1="110" y1="110" x2="110" y2="18" stroke="#E8B23A" strokeWidth="1.5" />
          {/* main sail */}
          <path
            d="M112 24 L112 104 L162 100 Z"
            stroke="#E8B23A"
            strokeWidth="1.5"
            fill="none"
          />
          {/* foresail */}
          <path
            d="M108 50 L108 104 L66 98 Z"
            stroke="#E8B23A"
            strokeWidth="1.5"
            fill="none"
          />
          {/* waterline */}
          <line x1="10" y1="128" x2="210" y2="128" stroke="#E8B23A" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
    </>
  );
}
