// src/theme.ts
// Single source of truth for design tokens.
// tailwind.config.ts imports `theme.colors` from here, so Tailwind classes
// (bg-navy, text-gold, …) and the few runtime style values stay in sync.

export const theme = {
  colors: {
    navy: '#0A1428', // page background
    navyLight: '#0D1B2E', // card / alternate section background
    ocean: '#1B3A5B', // chips, inputs, subtle fills
    oceanMid: '#2C5F7C', // borders, dividers
    gold: '#E8B23A', // primary accent
    goldBright: '#F2C94C', // hover accent
    textPrimary: '#E8EDF2', // body text      — 15.6:1 on navy
    textSecondary: '#9DB0C4', // muted text   — 8.3:1 on navy, 5.2:1 on ocean
  },
  fonts: {
    display: '"Cinzel", Georgia, serif', // headlines + section titles only
    body: '"Inter", system-ui, sans-serif', // everything else
  },
  motion: {
    durationFast: 300, // ms — hover/focus transitions
    durationNormal: 450, // ms — scroll reveal
    durationSlow: 600, // ms — hero entrance
    ease: 'power2.out', // GSAP easing
  },
} as const

export type Theme = typeof theme
