# Kailash Chaudhary — Portfolio

A cinematic, voyage-atmospheric single-page portfolio for **Kailash Chaudhary**, 2025 CS graduate and Cloud/DevOps + Python engineer. Seven scroll-driven sections tell the story of his skills, projects, and experience against a dark navy canvas with drifting gold particle motes, sunset gradient wash, and original SVG illustrations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 + TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | GSAP + ScrollTrigger |
| Particles | Custom canvas implementation (`ParticleBackground.tsx`) — no third-party particle library |
| 3D Cards | react-tilt |
| Fonts | Cinzel (display) · Inter (body) |

---

## Prerequisites

- **Node.js ≥ 18** — [nodejs.org](https://nodejs.org)
- **npm ≥ 9** — included with Node 18+

Verify your versions:

```bash
node -v   # should print v18.x or higher
npm -v    # should print 9.x or higher
```

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/kailashji24/portfolio-onepiece.git
cd portfolio-onepiece

# 2. Install dependencies (--legacy-peer-deps resolves @testing-library peer conflict)
npm install --legacy-peer-deps

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Build

```bash
# Type-check and compile to dist/
npm run build

# Preview the production build locally
npm run preview
```

The compiled output lands in `dist/`.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project on [vercel.com](https://vercel.com) — Vercel auto-detects the Vite config.
3. Leave all build settings at their defaults (`npm run build`, output `dist`).
4. Click **Deploy**. Every push to `main` triggers a re-deploy automatically.

`vercel.json` includes `"installCommand": "npm install --legacy-peer-deps"` to resolve the `@testing-library/react` peer dependency conflict in Vercel's clean CI environment.

### Netlify

**Option A — Drag and drop**

1. Run `npm run build` locally.
2. Drag the `dist/` folder onto the Netlify drop zone at [app.netlify.com](https://app.netlify.com).

**Option B — Connect repo**

1. Import the repo in the Netlify dashboard.
2. Set build command: `npm run build`, publish directory: `dist`.
3. The `public/_redirects` file handles SPA routing so direct URLs don't return 404.

---

## Features

| # | Section | Highlights |
|---|---|---|
| 1 | **Hero** | Cinzel stagger-letter reveal, cycling role typing animation, sunset gradient wash + radial amber sun glow, tech-glyph particle layer (cloud, terminal, DB, container, circuit, braces), VoyageMotifs captain-at-wheel + sailboat silhouettes, Resume download CTA |
| 2 | **About** | Bio, PREC/SPPU 2025 graduate, CGPA 7.90, Pune · open to Bengaluru |
| 3 | **Skills** | 8 skill categories (CI/CD, Cloud, IaC, ML, …), pill badges with gold hover glow |
| 4 | **Projects** | Weathered bounty-poster cards with react-tilt 3D, gold glow on hover, GitHub links |
| 5 | **Experience** | Alternating vertical timeline with gold dot nodes and ship's-log card styling |
| 6 | **Certifications** | Certification + publication cards; PDF download button on each certification card |
| 7 | **Contact** | Contact form (name / email / message → mailto), social links (email · GitHub · LinkedIn), Resume download CTA |

**Global extras**

- Custom gold dot + lagging ring cursor (desktop only, hidden on touch/mobile)
- Custom canvas particle system — ~60 drifting gold ember motes with flicker, `requestAnimationFrame` driven, static frame under `prefers-reduced-motion`
- Fixed grain/parchment texture overlay (`mix-blend-mode: screen`)
- GSAP ScrollTrigger scroll-driven reveal on every section
- `prefers-reduced-motion` respected throughout — transforms swapped for opacity-only, all CSS animations disabled

---

## Project Structure

```
src/
├── components/
│   ├── CustomCursor.tsx         # Gold dot + lagging outer ring cursor
│   ├── ParticleBackground.tsx   # Custom canvas ember particle system (fixed, full-viewport)
│   ├── VoyageMotifs.tsx         # Captain-at-wheel + sailboat SVG silhouettes (Hero only)
│   ├── TechGlyphs.tsx           # Floating tech icon glyphs — cloud, terminal, DB, container…
│   ├── Hero.tsx                 # Full-viewport landing: headline, typing roles, CTAs, illustrations
│   ├── About.tsx                # Bio, education stats, availability
│   ├── Skills.tsx               # Skill group cards with pill badges
│   ├── Projects.tsx             # Bounty-poster project cards with tilt effect
│   ├── Experience.tsx           # Vertical timeline of experience entries
│   ├── Certs.tsx                # Certification + publication cards with PDF download
│   └── Contact.tsx              # Contact form, social links, footer
├── hooks/
│   ├── useReducedMotion.ts      # Reads prefers-reduced-motion media query
│   ├── useScrollReveal.ts       # GSAP ScrollTrigger reveal helper
│   └── useTypingAnimation.ts    # Cycling role-title typing effect
├── data/
│   └── index.ts                 # All static content: projects, certs, experience, contact
├── utils/
│   ├── cursorInteractive.ts     # data-cursor="interactive" prop helper
│   └── mailto.ts                # Builds mailto: href from form fields
├── theme.ts                     # Design tokens: colours, fonts, motion config
├── App.tsx                      # Root shell: particle layer, grain overlay, section order
├── main.tsx
└── index.css                    # Global styles, CSS custom properties, grain overlay
```

**Static assets to place manually in `public/`:**

```
public/
├── resume.pdf                   # Linked from Hero + Contact "Download Resume" buttons
├── favicon.svg
├── icons.svg
├── _redirects                   # Netlify SPA routing
└── certs/
    ├── aws-saa.pdf              # AWS Solutions Architect Associate (Intellipaat)
    ├── iit-roorkee-devops.pdf   # Advanced Cloud Computing & DevOps (IIT Roorkee iHUB)
    └── forage-aws.pdf           # AWS Solutions Architecture Job Simulation (Forage)
```

---

## Contact

**Kailash Chaudhary**
Email: [kailash998955@gmail.com](mailto:kailash998955@gmail.com)
GitHub: [github.com/kailashji24](https://github.com/kailashji24)
LinkedIn: [linkedin.com/in/kailash-chaudhary24](https://linkedin.com/in/kailash-chaudhary24)

Open to Cloud/DevOps and Backend/Python roles — based in Pune, open to relocation.
