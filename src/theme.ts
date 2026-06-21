// src/theme.ts
// Central design token file — single source of truth for colors, fonts, and motion config.
// Imported by tailwind.config.ts and components for consistent theming.

export const theme = {
  colors: {
    base: {
      navy:      '#0A1428',  // primary background
      navyLight: '#0D1B2E',  // alternating section background
    },
    accent: {
      ocean:    '#1B3A5B',  // mid ocean accent
      oceanMid: '#2C5F7C',  // brighter ocean accent
    },
    gold: {
      // WCAG AA verified (vs navy #0A1428):
      //   #E8B23A →  9.50:1  ✓ (≥3:1 large/bold text)
      primary: '#E8B23A',  // primary gold accent / interactive highlights
      bright:  '#F2C94C',  // brighter gold variant
    },
    text: {
      // WCAG AA verified (vs navy #0A1428):
      //   #E8EDF2 → 15.59:1  ✓ (≥4.5:1 normal text)
      //   #8FA3B8 →  7.08:1  ✓ (≥3:1 large text)
      primary:   '#E8EDF2',  // off-white body text
      secondary: '#8FA3B8',  // muted secondary text
    },
  },
  fonts: {
    display: '"Cinzel", "Pirata One", serif',   // hero headlines + section headings only
    body:    '"Inter", "Satoshi", sans-serif',  // all body text, pills, labels
  },
  motion: {
    durationFast:   300,  // ms — hover/focus transitions
    durationNormal: 450,  // ms — scroll reveal, standard transitions
    durationSlow:   600,  // ms — hero animations, parallax
    ease:           'power2.out',  // GSAP easing string
  },
} as const

export type Theme = typeof theme
export type ThemeColors = typeof theme.colors
