# Implementation Plan: Kailash Chaudhary — Personal Portfolio

## Overview

Implementation plan for the portfolio website. Tasks are ordered from scaffold → infrastructure → sections → polish → deployment. The site is React + Vite + TypeScript, styled with Tailwind CSS, animated via GSAP + ScrollTrigger, with a tsParticles hero background, react-tilt project cards, and a `mailto:`-based contact form.

## Tasks

---

- [x] 1. Project scaffold and configuration
  - [x] 1.1 Scaffold Vite + React + TypeScript project using `npm create vite@latest kailash-portfolio -- --template react-ts`
    - Verify `vite.config.ts` at root, `tsconfig.json` with strict mode, and `src/main.tsx` entry point exist
    - _Requirements: 1.1_

  - [x] 1.2 Install Tailwind CSS with PostCSS and autoprefixer; create `tailwind.config.ts` extending the default theme with all custom color tokens from `theme.ts`
    - Tokens: navy, navyLight, ocean-mid, ocean-bright, gold, goldBright, text-primary, text-secondary
    - _Requirements: 1.2_

  - [x] 1.3 Create `src/theme.ts` exporting typed `theme.colors`, `theme.fonts`, and `theme.motion` constants
    - All hex color values must be valid 6-digit strings; motion durations are numbers (ms)
    - _Requirements: 1.3_

  - [x] 1.4 Set up `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`), Google Fonts `@import` for Cinzel and Inter with `display=swap`, CSS custom properties for colors, and the `.grain-overlay::after` noise-texture class
    - _Requirements: 1.2, 10.3_

  - [x] 1.5 Create `src/data/index.ts` with all typed constants: `projects: Project[]` (4 entries), `experiences: ExperienceEntry[]` (2 entries), `skillGroups: SkillGroup[]` (8 groups), certifications (3 entries), publication entry, and contact info
    - All GitHub URLs must be valid HTTPS strings; no content strings hardcoded outside this file or component-local constants
    - _Requirements: 1.4_

  - [x] 1.6 Create `src/assets/svgs/compass.svg` and `src/assets/svgs/rope-knot.svg` as inline-compatible SVG files
    - Compass: ~32×32px, gold stroke, no fill; Rope-knot: ~24×24px, muted gold
    - _Requirements: 10.4_

  - [x] 1.7 Add `public/_redirects` for Netlify SPA routing and `vercel.json` for Vercel SPA routing
    - _Requirements: 14.3_

  - [x] 1.8 Pin all dependency versions in `package.json` (remove `^`/`~` prefixes); commit `package-lock.json`
    - _Requirements: 14.4_

  - [x] 1.9 Create `README.md` at project root with project description, prerequisites (Node ≥ 18), `npm install`, `npm run dev`, `npm run build` commands, Vercel/Netlify deployment instructions, and feature overview
    - _Requirements: 14.1_

---

- [x] 2. Hooks and global utilities
  - [x] 2.1 Implement `src/hooks/useReducedMotion.ts` — reactive hook that reads `prefers-reduced-motion: reduce` via `window.matchMedia`, updates on OS setting change, and cleans up the event listener on unmount
    - Returns `boolean`; updates without page reload
    - _Requirements: 2.6_

  - [x] 2.2 Write property-based test for `useReducedMotion`
    - **Property 1: Reduced motion always respected** — mock `window.matchMedia` with both `matches: true` and `matches: false`; assert hook returns the correct boolean in each case
    - **Validates: Requirements 2.6, 11.4**
    - Use `fast-check` + `vitest`

  - [x] 2.3 Implement `src/hooks/useScrollReveal.ts` — accepts a container `ref` and options (`y`, `stagger`, `start`); animates direct children from `{ opacity: 0, y: 30 }` to `{ opacity: 1, y: 0 }` via GSAP ScrollTrigger (`once: true`); under `prefers-reduced-motion` immediately sets `{ opacity: 1, y: 0 }` without animation; kills ScrollTrigger instance on unmount
    - _Requirements: 2.5_

  - [x] 2.4 Implement `src/hooks/useTypingAnimation.ts` — cycles through an array of phrases, types at ~80ms/char, deletes at ~40ms/char, pauses ~1800ms at end of each phrase, loops indefinitely; under `prefers-reduced-motion` returns the full list as a static string; clears all `setTimeout` calls on unmount
    - Returns `{ displayText: string; isTyping: boolean }`
    - _Requirements: 3.3_

  - [x] 2.5 Write property-based test for `useTypingAnimation`
    - **Property 2: Typing animation completeness** — for any non-empty array of non-empty strings, `displayText` is always a prefix of one of the phrases in the array; `currentIndex` stays in `[0, phrases.length - 1]`; `displayText.length` stays in `[0, phrases[currentIndex].length]`
    - **Validates: Requirements 3.3**
    - Use `fast-check` with `fc.array(fc.string({ minLength: 1 }), { minLength: 1 })`

  - [x] 2.6 Implement `src/utils/mailto.ts` — exports `buildMailtoHref(state: ContactFormState): string` that constructs `mailto:kailash998955@gmail.com?subject=Portfolio Contact from {name}&body=...`; all field values URI-encoded via `encodeURIComponent`; makes no network requests
    - _Requirements: 9.1_

  - [x] 2.7 Write property-based test for `buildMailtoHref`
    - **Property 3: Contact form never sends data to third parties** — for any valid `{ name, email, message }`, output always starts with `mailto:kailash998955@gmail.com`; all fields are URI-encoded (no raw spaces, `@`, or special chars in the query string)
    - **Validates: Requirements 9.1**
    - Use `fast-check` with `fc.record({ name: fc.string({minLength:1}), email: fc.emailAddress(), message: fc.string({minLength:1}) })`

  - [x] 2.8 Configure Vitest in `vite.config.ts` and create `src/__tests__/` directory
    - _Requirements: 14.2_

---

- [x] 3. Global components
  - [x] 3.1 Implement `src/components/CustomCursor.tsx` — renders a 4px gold dot (no lag) and a ~20px ring outline with ~80ms lerp lag via `requestAnimationFrame`; both elements have `pointer-events: none`; ring scales to 2.5× and fills gold on `mouseenter` of any `[data-cursor="interactive"]` element; resets on `mouseleave`; returns `null` when `window.matchMedia('(pointer: fine)').matches === false` (covers all touch and stylus-only devices regardless of screen size — no viewport-width check, no user-agent sniffing) or when `reducedMotion === true`
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Implement `src/components/ParticleBackground.tsx` — tsParticles canvas using `@tsparticles/react` + `@tsparticles/slim`; ~60 slow-drifting particles; colors gold (`#E8B23A`) and off-white (`#E8EDF2`) at opacity 0.2–0.6; speed 0.3–0.8; `fpsLimit: 60`; canvas absolutely positioned behind content (`z-index: 0`); wraps load failure in try/catch and renders `null` on error; returns `null` when `reducedMotion` is true or viewport width < 768px
    - _Requirements: 2.3, 2.4_

  - [x] 3.3 Wire `CustomCursor` and `ParticleBackground` into `src/App.tsx`; register GSAP ScrollTrigger plugin on mount; pass `reducedMotion` result from `useReducedMotion()` down to all animated children
    - _Requirements: 11.4_

  - [x] 3.4 Add `data-cursor="interactive"` attribute to all links, buttons, and interactive cards across all sections
    - _Requirements: 2.1, 3.5, 9.2_

---

- [x] 4. Hero section — "Setting Sail"
  - [x] 4.1 Implement `src/components/Hero.tsx` skeleton with `min-height: 100vh`, `ParticleBackground` as absolutely-positioned layer (`z-index: 0`), and hero content at `z-index: 1`
    - _Requirements: 3.1_

  - [x] 4.2 Add display headline "Kailash Chaudhary" with Cinzel font family, ≥ 3rem on desktop with responsive scaling, off-white `#E8EDF2` color
    - _Requirements: 3.2_

  - [x] 4.3 Integrate `useTypingAnimation` to cycle role titles ("Cloud & DevOps Engineer", "Python Developer", "Backend Engineer", "AI/ML Builder") with a blinking cursor character; add `aria-live="polite"` region so screen readers announce changes; under `prefers-reduced-motion` display all four as a static comma-separated list
    - _Requirements: 3.3, 13.2_

  - [x] 4.4 Add tagline text "Early-career engineer shipping real cloud-scale systems — CI/CD, RAG pipelines, and infrastructure as code." styled with secondary color `#8FA3B8` and Inter/Satoshi body font
    - _Requirements: 3.4_

  - [x] 4.5 Implement CTA buttons: "View Projects" (gold fill, smooth scrolls to `#projects`) and "Get in Touch" (outlined, smooth scrolls to `#contact`); both have `data-cursor="interactive"`; hover adds brightness/glow with no bounce
    - _Requirements: 3.5_

  - [x] 4.6 Implement GSAP hero pin: pin section for 200px scroll travel; hero content fades to opacity 0.3 and shifts up 20px (scrub-linked); skip pin and fade when `reducedMotion` is true
    - _Requirements: 3.6_

  - [x] 4.7 Implement scroll indicator using `compass.svg` with subtle vertical oscillation animation (suppressed under `prefers-reduced-motion`); clicking/tapping scrolls to `#about`; fades out on scroll via ScrollTrigger
    - _Requirements: 3.7_

  - [x] 4.8 Implement parallax: particle canvas shifts at ~0.3× scroll speed; grain overlay shifts at ~0.15× scroll speed; both disabled under `prefers-reduced-motion`
    - _Requirements: 11.3_

---

- [x] 5. About section — "The Navigator"
  - [x] 5.1 Implement `src/components/About.tsx` with `id="about"`, semantic `<section>` + `<h2>` using Cinzel font; include bio text, education (PREC / SPPU, CGPA 7.90, Pune), and availability note ("open to Bengaluru")
    - _Requirements: 4.1_

  - [x] 5.2 Apply `useScrollReveal` to bio paragraphs and stat items with stagger 0.1s; trigger at `"top 80%"`; under `prefers-reduced-motion` content is immediately visible
    - _Requirements: 4.2_

---

- [x] 6. Skills section — "The Arsenal"
  - [x] 6.1 Implement `src/components/Skills.tsx` with `id="skills"`, section heading "The Arsenal" (Cinzel), rendering all 8 skill groups from `skillGroups` data with category label and skill pill tags
    - _Requirements: 5.1, 5.2_

  - [x] 6.2 Style skill pills with `#1B3A5B` (ocean-mid) background; add gold `#E8B23A` glow `box-shadow` on hover with 200–300ms CSS transition; instant under `prefers-reduced-motion`
    - _Requirements: 5.3_

  - [x] 6.3 Implement responsive grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`; verify no horizontal overflow at any breakpoint
    - _Requirements: 5.2, 12.1_

  - [x] 6.4 Apply `useScrollReveal` to skill group cards with stagger 0.08s
    - _Requirements: 5.4_

---

- [x] 7. Projects section — "The Treasure"
  - [x] 7.1 Implement `src/components/Projects.tsx` with `id="projects"`, section heading "The Treasure" (Cinzel), CSS grid `grid-cols-1 md:grid-cols-2`
    - _Requirements: 6.1_

  - [x] 7.2 Implement `ProjectCard` sub-component wrapping `react-tilt`'s `Tilt` component with options `{ max: 15, scale: 1.04, speed: 400 }`; disable tilt under `prefers-reduced-motion` or viewport < 768px by setting `{ max: 0, scale: 1 }`
    - _Requirements: 6.1, 6.3_

  - [x] 7.3 Style cards as weathered bounty posters: dark navy-to-navy gradient background, low-opacity noise overlay, gold title, muted stack-tag pills with ocean-mid background; muted border that glows gold on hover via CSS `box-shadow` transition
    - _Requirements: 6.2_

  - [x] 7.4 Render all four projects from `data/index.ts` with title, stack tags, impact summary, and GitHub link; GitHub links must have `target="_blank" rel="noopener noreferrer"` and `data-cursor="interactive"`
    - _Requirements: 6.1, 6.2, 10.1_

  - [x] 7.5 Apply `useScrollReveal` to project cards with stagger 0.15s
    - _Requirements: 6.4_

---

- [x] 8. Experience section — "The Logbook"
  - [x] 8.1 Implement `src/components/Experience.tsx` with `id="experience"`, section heading "The Logbook" (Cinzel), vertical timeline layout with visible connecting line between nodes
    - _Requirements: 7.1_

  - [x] 8.2 Implement `TimelineNode` sub-component: gold circle dot, date badge, role title, company name, and bullet-point list; style as ship's log with gold/ocean vertical line and parchment-toned text
    - _Requirements: 7.1_

  - [x] 8.3 Render both experience entries from data with all bullet points; apply per-node scroll reveal animating from `{ opacity: 0, x: -30 }` to visible with stagger 0.15s; ScrollTrigger `start: "top 80%"` per node; skip animation under `prefers-reduced-motion`
    - _Requirements: 7.2_

  - [x] 8.4 Implement responsive layout: content to the right of the vertical line on desktop; single column with line on left edge and indented content on mobile (< 768px)
    - _Requirements: 7.3_

---

- [x] 9. Certifications and publication section — "The Marks"
  - [x] 9.1 Implement `src/components/Certs.tsx` with `id="certs"`, section heading "The Marks" (Cinzel); render all three certifications (AWS SAA — Intellipaat Mar 2025, Advanced Cloud & DevOps — IIT Roorkee iHUB Jul 2025, AWS Architecture Job Simulation — Forage Jul 2025) showing certification name, issuer, and date
    - _Requirements: 8.1_

  - [x] 9.2 Render the publication entry ("Investigation on Human Activity Recognition using Deep Learning", IRJMETS Vol.07 Issue 02, Feb 2025) with a visually distinct "Publication" badge label
    - _Requirements: 8.2_

  - [x] 9.3 Apply `useScrollReveal` with stagger 0.1s; add `id="certs"` and semantic heading
    - _Requirements: 8.3_

---

- [x] 10. Contact section — "Send a Message in a Bottle"
  - [x] 10.1 Implement `src/components/Contact.tsx` with `id="contact"`, section heading "Send a Message in a Bottle"; form fields: Name (text), Email (email), Message (textarea)
    - _Requirements: 9.1_

  - [x] 10.2 Integrate `buildMailtoHref` from `src/utils/mailto.ts`: on form submit, construct and navigate to the `mailto:` URI; make no network requests; form must be submittable via Enter key
    - _Requirements: 9.1, 13.1_

  - [x] 10.3 Add client-side validation: Name, Email, and Message must be non-empty before submit; Email must match `/.+@.+\..+/`; display visible inline error messages for each failing field
    - _Requirements: 9.1_

  - [x] 10.4 Display `kailash998955@gmail.com` as a `mailto:` link, `github.com/kailashji24` and `linkedin.com/in/kailash-chaudhary24` as external links; all external links have `target="_blank" rel="noopener noreferrer"` and `data-cursor="interactive"`; SVG icons glow gold on hover with a 200ms CSS transition
    - _Requirements: 9.2, 9.3_

  - [x] 10.5 Apply `useScrollReveal` to contact section content
    - _Requirements: 9.1_

  - [x] 10.6 Implement footer with availability text "Available immediately · Open to relocation to Bengaluru", copyright with current year, and rope-knot SVG divider (inline SVG, `aria-hidden="true"`)
    - _Requirements: 9.4_

---

- [x] 11. Accessibility and visual polish
  - [x] 11.1 Add `:focus-visible` gold ring outline (2px, 2px offset) to all focusable elements in `src/index.css`; audit and fix keyboard tab order across all sections so it flows logically through nav, CTAs, project cards, form, and social links
    - _Requirements: 13.1_

  - [x] 11.2 Add `aria-hidden="true"` to all purely decorative SVGs (compass ornament, rope-knot); add descriptive `aria-label` to functional SVG icons (GitHub, LinkedIn)
    - _Requirements: 13.2_

  - [x] 11.3 Verify WCAG AA color contrast: body text `#E8EDF2` on `#0A1428` ≥ 4.5:1; secondary text `#8FA3B8` on `#0A1428` ≥ 3:1 for large text; gold accent on dark background ≥ 3:1 for large/bold text
    - _Requirements: 13.3_

  - [x] 11.4 Verify no horizontal overflow at 375px viewport width; verify all tap targets ≥ 44×44px on mobile
    - _Requirements: 12.1_

  - [x] 11.5 Verify the approved color palette is used exclusively: only `#0A1428`, `#0D1B2E`, `#1B3A5B`, `#2C5F7C`, `#E8B23A`, `#F2C94C`, `#E8EDF2`, `#8FA3B8` as primary colors; Cinzel used only on hero name and section headings; Inter/Satoshi for all body text
    - _Requirements: 10.1, 10.2_

  - [x] 11.6 Verify compass SVG is used only for scroll indicator and at most one section heading; rope-knot SVG used only as footer divider; no One Piece logos or cartoon character imagery anywhere
    - _Requirements: 10.4_

---

- [x] 12. Testing and build quality
  - [x] 12.1 Run all property-based tests (`npx vitest --run`) and confirm `useReducedMotion`, `useTypingAnimation`, and `buildMailtoHref` PBT suites pass with zero failures
    - _Requirements: 2.6, 3.3, 9.1_

  - [x] 12.2 Run `npm run build` and confirm zero TypeScript errors, zero unresolved imports, and successful `dist/` output with `index.html` and hashed asset files
    - _Requirements: 14.2_

  - [x] 12.3 Run `npm audit` and resolve any high or critical severity vulnerabilities before marking complete
    - _Requirements: 14.4_

  - [x] 12.4 Verify `vite.config.ts` has `base: '/'`; test production build locally with `npm run preview`
    - _Requirements: 14.3_

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; all other tasks must be completed
- PBT tasks (2.2, 2.5, 2.7) use `fast-check` with `vitest` as the runner — run with `npx vitest --run`
- `prefers-reduced-motion` check must be the first guard in every animated component
- tsParticles should be lazy-loaded (dynamic import) to keep initial bundle size small
- Google Fonts `@import` must include `display=swap` to prevent FOIT
- `react-tilt` and GSAP ScrollTrigger must be imported only in the components that use them (no global imports)
- `src/data/index.ts` is the single source of truth for all content — no content strings should be hardcoded in component files
- The contact form uses `mailto:` exclusively — no Formspree, no fetch/XHR, no third-party form service
- Certifications count: 3 certs total (AWS SAA, Advanced Cloud & DevOps, AWS Architecture Simulation)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.6", "1.7", "1.8", "1.9"] },
    { "id": 2, "tasks": ["1.4", "1.5", "2.8"] },
    { "id": 3, "tasks": ["2.1", "2.3", "2.4", "2.6"] },
    { "id": 4, "tasks": ["2.2", "2.5", "2.7", "3.1", "3.2"] },
    { "id": 5, "tasks": ["3.3"] },
    { "id": 6, "tasks": ["3.4", "4.1"] },
    { "id": 7, "tasks": ["4.2", "4.3", "4.4", "4.5"] },
    { "id": 8, "tasks": ["4.6", "4.7", "4.8", "5.1", "6.1", "7.1", "8.1", "9.1", "10.1"] },
    { "id": 9, "tasks": ["5.2", "6.2", "6.3", "7.2", "7.3", "7.4", "8.2", "9.2", "10.2", "10.3", "10.4"] },
    { "id": 10, "tasks": ["6.4", "7.5", "8.3", "8.4", "9.3", "10.5", "10.6"] },
    { "id": 11, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6"] },
    { "id": 12, "tasks": ["12.1", "12.2", "12.3", "12.4"] }
  ]
}
```
