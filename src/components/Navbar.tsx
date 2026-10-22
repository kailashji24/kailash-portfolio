// src/components/Navbar.tsx
// Fixed top navigation.
//   - Transparent over the hero, solid navy + blur once the page scrolls
//   - Highlights the section currently in view (IntersectionObserver)
//   - Collapses to a menu button below md; Escape closes the menu

import { useEffect, useState } from 'react'
import { navSections, profile } from '../data/index'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')

  // Solid background after the first 40px of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active-section tracking
  useEffect(() => {
    const els = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0 || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'border-b border-oceanMid/40 bg-navy/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8"
      >
        <a
          href="#hero"
          {...CURSOR_INTERACTIVE}
          className="flex min-h-[44px] min-w-[44px] items-center gap-2 font-display text-lg font-semibold tracking-wide text-textPrimary no-underline"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full border border-gold text-xs text-gold"
          >
            KC
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                {...CURSOR_INTERACTIVE}
                aria-current={active === s.id ? 'location' : undefined}
                className={`inline-flex min-h-[44px] items-center rounded px-3 text-sm font-medium no-underline transition-colors hover:text-gold focus-visible:text-gold ${
                  active === s.id ? 'text-gold' : 'text-textSecondary'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li className="ml-3">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...CURSOR_INTERACTIVE}
              className="btn-outline btn-sm"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          {...CURSOR_INTERACTIVE}
          className="grid h-11 w-11 place-items-center rounded text-textPrimary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div id="mobile-menu" hidden={!open} className="border-t border-oceanMid/40 px-6 pb-6 md:hidden">
        <ul className="flex flex-col py-2">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`block py-3 text-base font-medium no-underline ${
                  active === s.id ? 'text-gold' : 'text-textPrimary'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full"
          onClick={() => setOpen(false)}
        >
          View Resume
        </a>
      </div>
    </header>
  )
}
