# Requirements Document

## Introduction

This document specifies the functional and non-functional requirements for the Kailash Chaudhary personal portfolio website — a dark-cinematic, One Piece–atmospheric single-page application built with React + Vite + TypeScript. The site showcases seven content sections (Hero, About, Skills, Projects, Experience, Certifications, Contact) with scroll-driven animations, a custom gold cursor, and tsParticles background. The primary audience is engineering recruiters; the primary goals are strong first impression, clear communication of technical skills and project impact, and a delightful narrative scroll experience that degrades gracefully for accessibility and performance constraints.

---

## Glossary

- **App**: The root React component that composes all sections and mounts global overlays.
- **CustomCursor**: The component that renders a gold dot + lagging outer ring replacing the native browser cursor.
- **ParticleBackground**: The full-screen tsParticles canvas rendering drifting gold motes.
- **Hero**: The first-impression section containing the name headline, typing animation, tagline, and CTAs.
- **TypingText**: The animated component that types and deletes cycling through an array of role strings.
- **About**: The section displaying bio, education, and location details.
- **Skills**: The section displaying categorised skill badges with staggered scroll reveal.
- **Projects**: The section displaying project cards styled as 3D-tilt weathered bounty posters.
- **Experience**: The section displaying a vertical timeline of internship entries.
- **Certs**: The section displaying certifications and publications.
- **Contact**: The section displaying social links and availability statement.
- **SectionWrapper**: A Higher-Order Component (HOC) that wraps sections and applies consistent scroll-triggered reveal animations.
- **ScrollReveal**: The mechanism (via `useScrollReveal` hook + GSAP ScrollTrigger) that animates section content into view on scroll.
- **useReducedMotion**: A React hook that reads the `prefers-reduced-motion` media query and returns a reactive boolean.
- **GSAP**: The GreenSock Animation Platform library used for scroll and transition animations.
- **ScrollTrigger**: The GSAP plugin that ties animations to scroll position.
- **tsParticles**: The particle animation library rendering the background motes.
- **react-tilt**: The library that applies a 3D tilt effect to project cards.
- **AbortSignal**: A Web API object used to cancel asynchronous loops (e.g., the typing animation).
- **data-cursor-expand**: An HTML attribute applied to interactive elements to trigger cursor ring expansion.
- **data-reveal**: An HTML attribute applied to child elements inside a `SectionWrapper` to mark them for scroll-reveal animation.
- **Cinzel**: The serif display font used for headings.
- **Inter**: The sans-serif body font used for body text.
- **Reduced Motion Mode**: The application state when `useReducedMotion()` returns `true`.
- **fast-check**: The property-based testing library used for automated correctness verification.
- **Vitest**: The test runner used for unit and property-based tests.

---

## Requirements

### Requirement 1: Application Shell and Global Composition

**User Story:** As a recruiter, I want the portfolio to load as a cohesive single-page experience, so that I can navigate all sections without page reloads.

#### Acceptance Criteria

1. THE App SHALL render all seven sections — Hero, About, Skills, Projects, Experience, Certs, and Contact — in that order within a single HTML page.
2. THE App SHALL mount the CustomCursor and ParticleBackground components as fixed-position overlays before rendering section content.
3. WHEN the application initialises, THE App SHALL register the GSAP ScrollTrigger plugin before any section attempts to use it.
4. THE App SHALL expose a `ThemeContext` that provides color, font, and motion configuration values to all child components.
5. WHEN the viewport width is less than 768 pixels, THE App SHALL not mount the CustomCursor component.

---

### Requirement 2: Custom Cursor

**User Story:** As a recruiter browsing on desktop, I want a distinctive gold cursor that responds to interactive elements, so that the site feels crafted and premium.

#### Acceptance Criteria

1. WHEN the CustomCursor component is mounted, THE CustomCursor SHALL hide the native browser cursor via a `cursor: none` CSS rule applied to the document.
2. WHEN a `mousemove` event fires, THE CustomCursor SHALL update the gold dot's position to `(event.clientX, event.clientY)` without any lag.
3. WHEN a `mousemove` event fires, THE CustomCursor SHALL animate the outer ring to follow the dot position with a GSAP tween of duration 0.15 seconds, creating a trailing effect.
4. WHEN the pointer enters an element carrying the `data-cursor-expand` attribute, THE CustomCursor SHALL scale the outer ring to 2.5× its default size and reduce its opacity to 0.6.
5. WHEN the pointer leaves an element carrying the `data-cursor-expand` attribute, THE CustomCursor SHALL scale the outer ring back to 1× and restore its opacity to 1.0.
6. WHEN the CustomCursor component unmounts, THE CustomCursor SHALL remove all bound `mousemove`, `mouseenter`, and `mouseleave` event listeners and kill all active GSAP tweens on the cursor elements.
7. IF the device pointer type is `none` (touch-only device), THEN THE CustomCursor SHALL not render its DOM elements.

---

### Requirement 3: Particle Background

**User Story:** As a recruiter, I want an atmospheric animated background, so that the site conveys a cinematic ocean voyage theme.

#### Acceptance Criteria

1. WHEN the ParticleBackground component mounts and reduced motion is disabled, THE ParticleBackground SHALL initialise a tsParticles canvas with 60 slow-drifting gold mote particles over a transparent background.
2. WHILE the ParticleBackground is rendering with reduced motion disabled, THE ParticleBackground SHALL position the canvas at z-index 0 with `pointer-events: none` so it never intercepts user interactions.
3. WHEN `reducedMotion` is `true`, THE ParticleBackground SHALL render a static navy gradient background and SHALL NOT initialise any tsParticles animation.
4. IF tsParticles fails to initialise, THEN THE ParticleBackground SHALL render a non-empty fallback element displaying the base navy background colour so the page is never blank.
5. WHEN the viewport width is less than 768 pixels, THE ParticleBackground SHALL reduce the particle count to 30.

---

### Requirement 4: Hero Section

**User Story:** As a recruiter, I want to immediately understand who Kailash is and what he does, so that I can quickly assess fit for open roles.

#### Acceptance Criteria

1. WHEN the Hero section mounts, THE Hero SHALL display "Kailash Chaudhary" as the primary headline using the Cinzel display font with a GSAP stagger-letter reveal animation.
2. WHEN the Hero section mounts, THE Hero SHALL render a TypingText component cycling through the role strings: "Cloud & DevOps Engineer", "Python Developer", "Backend Engineer", and "AI/ML Builder".
3. THE Hero SHALL display a tagline and two CTA buttons labelled "View Projects" and "Get in Touch", each carrying the `data-cursor-expand` attribute.
4. THE Hero SHALL render a ScrollIndicator element (compass/log-pose needle SVG) to guide users to scroll down.
5. WHEN the user scrolls past the Hero section trigger threshold, THE Hero SHALL pin the hero section briefly and fade it out using a GSAP ScrollTrigger with scrubbing enabled.
6. IF reduced motion is enabled, THEN THE Hero SHALL display the headline and content in their final visible state without stagger-letter or fade-out scroll animations.

---

### Requirement 5: Typing Text Animation

**User Story:** As a recruiter, I want to see Kailash's roles cycle through an animated text display, so that I understand the breadth of his technical focus.

#### Acceptance Criteria

1. WHEN the TypingText component is rendered with a non-empty `strings` array, THE TypingText SHALL cycle through all strings indefinitely, typing each character at `typeSpeed` milliseconds per character and deleting each character at `deleteSpeed` milliseconds per character.
2. WHILE the TypingText is in the type phase, THE TypingText SHALL display only prefixes of the current target string at each step.
3. WHILE the TypingText is in the delete phase, THE TypingText SHALL display progressively shorter prefixes of the current string, with the displayed length strictly decreasing at each step.
4. WHEN a string is fully typed, THE TypingText SHALL pause for `pauseMs` milliseconds before beginning the delete phase.
5. WHEN the controlling AbortSignal fires, THE TypingText SHALL terminate the typing loop and SHALL NOT call the text-setter callback after the signal has fired.
6. WHEN the TypingText component unmounts, THE TypingText SHALL abort the typing loop and clear any pending timers.

---

### Requirement 6: About Section

**User Story:** As a recruiter, I want to read a concise professional bio with education and location details, so that I can assess Kailash's background at a glance.

#### Acceptance Criteria

1. THE About section SHALL display Kailash's professional bio, education institution (PREC, SPPU, 2025 graduate), CGPA (7.90), and location (Pune, open to Bengaluru).
2. WHEN the About section enters the viewport, THE SectionWrapper SHALL trigger a scroll-reveal animation on all child elements marked with `data-reveal`.
3. THE About section SHALL optionally render a decorative compass SVG motif in the section corner.

---

### Requirement 7: Skills Section

**User Story:** As a recruiter, I want to see Kailash's technical skills organised by category, so that I can quickly identify relevant technologies.

#### Acceptance Criteria

1. THE Skills section SHALL display skill badges grouped into the following categories: CI/CD, Containers & Orchestration, AWS / Cloud, IaC, Observability, Backend / APIs, AI / ML, and Scripting & Tools.
2. WHEN the Skills section enters the viewport, THE Skills section SHALL animate each skill badge into view with a staggered GSAP reveal using `ScrollTrigger.batch()` to reduce per-element trigger overhead.
3. WHEN reduced motion is enabled, THE Skills section SHALL reveal skill badges with an opacity-only transition, omitting any y-offset movement.

---

### Requirement 8: Projects Section

**User Story:** As a recruiter, I want to view Kailash's projects with their tech stack and impact, so that I can evaluate the depth and relevance of his work.

#### Acceptance Criteria

1. THE Projects section SHALL display project cards for all entries in the `PROJECTS` data array, each card showing the project title, stack tags, impact description, and a GitHub link.
2. THE Projects section SHALL render each card wrapped in a `react-tilt` component with `tiltMaxAngleX` and `tiltMaxAngleY` both set to 10 degrees, glare enabled, and `maxGlare` set to 0.15.
3. WHEN a project card receives hover focus, THE ProjectCard SHALL apply a gold border glow and a lift effect via CSS transitions.
4. WHEN a GitHub link on a project card is activated, THE ProjectCard SHALL open the URL in a new browser tab using `target="_blank"` with `rel="noopener noreferrer"`.
5. THE Projects section SHALL render stack technology entries as distinct small badge elements within each card.
6. FOR ALL projects P in the `PROJECTS` data array, P SHALL have a non-empty `title`, at least one `stack` entry, a non-empty `impact` string, and a `githubUrl` that begins with `https://`.

---

### Requirement 9: Experience Section

**User Story:** As a recruiter, I want to see Kailash's work history on a visual timeline, so that I can understand his professional progression.

#### Acceptance Criteria

1. THE Experience section SHALL render a vertical timeline with one `TimelineNode` per entry in the `EXPERIENCE` data array, each node displaying the role title, company name, period, and bullet-point responsibilities.
2. THE Experience section SHALL style the connecting vertical line to resemble a map route or ship's log.
3. WHEN the Experience section is viewed on a viewport wider than 768 pixels, THE Experience section SHALL alternate `TimelineNode` entries between left and right sides of the timeline.
4. WHEN the Experience section is viewed on a viewport 768 pixels wide or narrower, THE Experience section SHALL stack all `TimelineNode` entries in a single column.
5. WHEN each `TimelineNode` enters the viewport, THE ScrollReveal mechanism SHALL animate it into view using GSAP ScrollTrigger.

---

### Requirement 10: Certifications Section

**User Story:** As a recruiter, I want to see Kailash's certifications and publications, so that I can verify his credentials and research contributions.

#### Acceptance Criteria

1. THE Certs section SHALL display one `CertCard` per entry in the `CERTIFICATIONS` data array, each card showing the title, issuer, date, and type (certification or publication).
2. WHERE a certification entry includes a `url` field, THE CertCard SHALL render a link to that URL.
3. WHEN the Certs section enters the viewport, THE SectionWrapper SHALL trigger a scroll-reveal animation on the certification cards.

---

### Requirement 11: Contact Section

**User Story:** As a recruiter, I want clear contact options, so that I can reach out to Kailash directly.

#### Acceptance Criteria

1. THE Contact section SHALL display all configured social and contact links, each rendered as an accessible anchor element with a visible label and icon.
2. WHEN a contact link is activated, THE Contact section SHALL open the link using the appropriate protocol (`mailto:` for email, `https://` for external profiles) in a new tab where applicable with `rel="noopener noreferrer"`.
3. THE Contact section SHALL display an availability statement indicating Kailash's openness to new opportunities.

---

### Requirement 12: Section Scroll Reveal

**User Story:** As a recruiter browsing the portfolio, I want content to animate gracefully into view as I scroll, so that the reading experience feels dynamic and polished.

#### Acceptance Criteria

1. WHEN a section wrapped in `SectionWrapper` enters the viewport at `top 85%`, THE SectionWrapper SHALL trigger a GSAP `from` animation on all `[data-reveal]` child elements, animating from `{ y: 30, opacity: 0 }` to `{ y: 0, opacity: 1 }` with a stagger of 0.1 seconds and duration of 0.6 seconds.
2. WHEN reduced motion is enabled, THE SectionWrapper SHALL animate `[data-reveal]` elements using only an opacity transition (`{ opacity: 0 }` to `{ opacity: 1 }`), omitting any y-offset movement.
3. WHEN a section with scroll-reveal animations is unmounted, THE SectionWrapper SHALL kill the associated GSAP tween to prevent memory leaks.
4. IF GSAP or ScrollTrigger fails to load, THEN THE SectionWrapper SHALL fall back to a CSS class toggle that sets `opacity: 1` and `transform: none` on target elements so all content remains visible.

---

### Requirement 13: Reduced Motion Accessibility

**User Story:** As a user with vestibular or motion sensitivity, I want the portfolio to respect my operating system's reduced-motion preference, so that I can browse without triggering discomfort.

#### Acceptance Criteria

1. THE useReducedMotion hook SHALL read the `prefers-reduced-motion: reduce` media query and return `true` when the preference is active.
2. WHEN the user's `prefers-reduced-motion` preference changes at runtime, THE useReducedMotion hook SHALL update its return value reactively.
3. WHILE reduced motion is active, THE App SHALL not apply any `transform` or `y`-offset animation to any component — only opacity transitions are permitted.
4. WHILE reduced motion is active, THE Hero section SHALL display its content in the final visible state without the GSAP pin or scroll-fade animation.
5. WHILE reduced motion is active, THE ParticleBackground SHALL render a static background and SHALL NOT run the tsParticles animation loop.

---

### Requirement 14: Responsive Layout

**User Story:** As a recruiter browsing on a mobile device, I want the portfolio to be fully usable on small screens, so that I can review it anywhere.

#### Acceptance Criteria

1. THE portfolio SHALL be fully readable and navigable on viewport widths from 320 pixels to 1920 pixels.
2. WHEN the viewport width is less than 768 pixels, THE App SHALL not mount the CustomCursor component and the browser's native cursor behaviour SHALL remain unaffected.
3. WHEN the viewport width is less than 768 pixels, THE Experience section SHALL stack timeline entries in a single column layout.
4. WHEN the viewport width is less than 768 pixels, THE ParticleBackground SHALL reduce the active particle count to 30.

---

### Requirement 15: Performance

**User Story:** As a recruiter on a typical internet connection, I want the portfolio to load quickly, so that I'm not waiting for content.

#### Acceptance Criteria

1. THE App SHALL lazy-load each section component using `React.lazy` and `Suspense` so that the initial bundle delivers only the Hero section and global overlays.
2. THE Skills section SHALL use `ScrollTrigger.batch()` to register skill badge animations, reducing per-element ScrollTrigger overhead.
3. THE portfolio build SHALL split vendor libraries (GSAP, tsParticles) into a separate chunk from application code using Vite's `manualChunks` configuration.
4. THE `index.html` SHALL include a `<link rel="preload">` directive for the Cinzel woff2 font file to prevent a Flash of Unstyled Text on the hero headline.

---

### Requirement 16: Security and External Links

**User Story:** As a user clicking portfolio links, I want external navigation to be safe, so that I'm not exposed to tab-napping or other browser exploits.

#### Acceptance Criteria

1. FOR ALL anchor elements A in the portfolio where `A.target === "_blank"`, THE portfolio SHALL set `A.rel` to include both `"noopener"` and `"noreferrer"`.
2. THE Contact section SHALL use `mailto:` protocol for email links rather than a server-side form, so that no user data is transmitted to a backend.
3. THE portfolio SHALL not use `dangerouslySetInnerHTML`; all dynamic content SHALL originate from the static `content.ts` data file as plain strings.

---

### Requirement 17: Typography and Theme

**User Story:** As a recruiter, I want a visually consistent and readable portfolio, so that the content is easy to scan and the branding feels intentional.

#### Acceptance Criteria

1. THE portfolio SHALL apply Cinzel (serif) as the display font for all section headings and the hero headline.
2. THE portfolio SHALL apply Inter (sans-serif) as the body font for all body text, skill badges, and UI labels.
3. IF Google Fonts or the self-hosted font file fails to load, THEN THE portfolio SHALL fall back to a system serif font for display text and a system sans-serif font for body text, preserving visual hierarchy.
4. THE portfolio SHALL use the following base colour tokens consistently across all components: navy `#0A1428` for backgrounds, gold primary `#E8B23A` for accents and interactive highlights, and text primary `#E8EDF2` for body copy.

---

### Requirement 18: Error Handling and Graceful Degradation

**User Story:** As a recruiter, I want the portfolio to remain usable even if optional features fail to load, so that I can always view Kailash's content.

#### Acceptance Criteria

1. IF the tsParticles engine fails to initialise, THEN THE ParticleBackground SHALL render a fallback navy gradient background and SHALL NOT display an error state to the user.
2. IF GSAP or ScrollTrigger fails to load, THEN THE SectionWrapper SHALL fall back to a CSS opacity toggle so all content sections remain visible without animation.
3. IF a Google Fonts or self-hosted font request fails, THEN THE portfolio SHALL display all text using system font fallbacks without layout shifts that obscure content.
4. WHEN a GitHub project link is activated and the target repository is unavailable, THE portfolio SHALL not display an in-page error — the user SHALL be redirected to the standard GitHub 404 page in a new tab.
