# Kailash Chaudhary — Portfolio

[![CI](https://github.com/kailashji24/kailash-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/kailashji24/kailash-portfolio/actions/workflows/ci.yml)

**Live:** https://kailash-portfolio-eight.vercel.app

Single-page portfolio for **Kailash Chaudhary**, Cloud & DevOps engineer (B.E. Computer Science, 2025). A nautical theme (navy, gold, sunset hero, original line-art) wraps a recruiter-first layout: sticky navigation, project cards with verifiable outcomes, a timeline, certifications and a contact section with one-click email copy.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 + Vite 8 |
| Styling | Tailwind CSS 3, tokens in `src/theme.ts` (shared with Tailwind) |
| Animation | GSAP + ScrollTrigger, custom canvas particles, CSS keyframes |
| Fonts | Cinzel + Inter, self-hosted via `@fontsource` (no third-party requests) |
| Tests | Vitest + Testing Library + fast-check (property-based) |
| CI | GitHub Actions — lint, test, build on every push and PR |
| Hosting | Vercel (security headers in `vercel.json`), Netlify-compatible |

No `--legacy-peer-deps` needed: every dependency is pinned and peer-compatible with React 19.

---

## Getting started

Requires **Node.js ≥ 20**.

```bash
git clone https://github.com/kailashji24/kailash-portfolio.git
cd kailash-portfolio
npm ci
npm run dev        # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run lint` | ESLint (TypeScript + React hooks rules) |
| `npm test` | Run all tests once |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Editing content

All user-facing copy lives in **`src/data/index.ts`** — profile, projects, experience, skills, certifications and contact details. Components never hardcode text, so update one file and every section (and the contact form's `mailto:`) follows.

Project cards follow one rule: **every outcome must be verifiable in the linked repository.**

If the site moves to a custom domain, update `profile.siteUrl` in `src/data/index.ts` and the canonical / Open Graph URLs in `index.html`.

---

## Deployment

**Vercel** — import the repo; defaults work (`npm run build`, output `dist`). `vercel.json` adds SPA rewrites, a Content-Security-Policy and other security headers, and long-term caching for hashed assets.

**Netlify** — build command `npm run build`, publish directory `dist`. `public/_redirects` handles SPA routing.

---

## Project structure

```
src/
├── components/
│   ├── Navbar.tsx               # Sticky nav, active-section highlight, mobile menu
│   ├── SectionHeading.tsx       # Shared "eyebrow + themed title" heading
│   ├── Hero.tsx                 # Name, role, pitch, CTAs, illustrations
│   ├── About.tsx · Skills.tsx · Projects.tsx · Experience.tsx · Certs.tsx · Contact.tsx
│   ├── CustomCursor.tsx         # Desktop-only cursor (delegated hover detection)
│   ├── ParticleBackground.tsx   # DPR-aware canvas motes, pauses when tab hidden
│   ├── TechGlyphs.tsx · VoyageMotifs.tsx   # Decorative hero layers
├── hooks/
│   ├── useReducedMotion.ts      # prefers-reduced-motion
│   ├── useScrollReveal.ts       # GSAP ScrollTrigger reveal
│   ├── useTilt.ts               # Lightweight 3D hover tilt for cards
│   └── useTypingAnimation.ts    # (currently unused; kept with its tests)
├── data/index.ts                # ALL site content
├── utils/                       # mailto builder, cursor opt-in helper
├── theme.ts                     # Design tokens (imported by tailwind.config.ts)
└── index.css                    # Base styles + .btn / .card / .chip / .field components

public/
├── Kailash_Chaudhary_Resume.pdf
├── certs/                       # Certificate PDFs
├── papers/irjmets-har-2025.pdf  # Published paper
├── og-image.png                 # 1200×630 link-preview image
├── favicon.svg · apple-touch-icon.png
└── _redirects                   # Netlify SPA routing
```

---

## Accessibility

- Skip link, landmark sections labelled by their headings, visible gold focus ring
- Text contrast ≥ 4.5:1 everywhere (muted text is 8.3:1 on the page background)
- Tap targets ≥ 44 × 44 px
- `prefers-reduced-motion` turns off the cursor, particles motion, tilt, reveals and keyframe animations

---

## Contact

**Kailash Chaudhary** · [kailash998955@gmail.com](mailto:kailash998955@gmail.com) · [GitHub](https://github.com/kailashji24) · [LinkedIn](https://linkedin.com/in/kailash-chaudhary24)
