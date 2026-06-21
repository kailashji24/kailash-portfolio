// src/components/Contact.tsx
// Contact section — "Send a Message in a Bottle"
//
// Tasks covered:
//   10.1  Section scaffold: id="contact", h2, form fields (Name, Email, Message)
//   10.2  Submit via buildMailtoHref → window.location.href; no network requests;
//         Enter key submits the form
//   10.3  Client-side validation: all fields non-empty; email /.+@.+\..+/;
//         inline error messages per field
//   10.4  Social links (email mailto, GitHub, LinkedIn) with target/rel/data-cursor;
//         SVG icons glow gold on hover with 200ms transition
//   10.5  useScrollReveal applied to section content
//   10.6  Footer: availability blurb, copyright year, rope-knot SVG divider
//
// Props: { reducedMotion: boolean }

import { useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { buildMailtoHref } from '../utils/mailto'
import { contactInfo } from '../data/index'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import { theme } from '../theme'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContactProps {
  reducedMotion: boolean
}

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

// ---------------------------------------------------------------------------
// Inline SVG icons (task 10.4)
// ---------------------------------------------------------------------------

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.025 10.025 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Rope-knot SVG — inlined from src/assets/svgs/rope-knot.svg (task 10.6)
// ---------------------------------------------------------------------------

function RopeKnotSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="32"
      height="32"
      fill="none"
      aria-hidden="true"
    >
      {/* Left loop */}
      <path
        d="M6 12 C6 7, 1 7, 1 12 C1 17, 6 17, 6 12 C6 9, 9 8, 12 12"
        stroke="#8FA3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right loop */}
      <path
        d="M18 12 C18 7, 23 7, 23 12 C23 17, 18 17, 18 12 C18 9, 15 8, 12 12"
        stroke="#8FA3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crossing strand — left over right */}
      <path
        d="M9 10 C10 11, 11 11.5, 12 12"
        stroke="#8FA3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 12 C13 12.5, 14 13, 15 14"
        stroke="#8FA3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Center knot cross-over */}
      <path
        d="M9 14 C10 13, 11 12.5, 11.4 12.2"
        stroke="#8FA3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12.6 11.8 C13 11.5, 14 11, 15 10"
        stroke="#8FA3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Validation (task 10.3)
// ---------------------------------------------------------------------------

const EMAIL_RE = /.+@.+\..+/

function validate(fields: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!fields.name.trim()) {
    errors.name = 'Name is required.'
  }
  if (!fields.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_RE.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!fields.message.trim()) {
    errors.message = 'Message is required.'
  }
  return errors
}

// ---------------------------------------------------------------------------
// SocialLink — icon link with gold glow on hover (task 10.4)
// ---------------------------------------------------------------------------

interface SocialLinkProps {
  href: string
  label: string
  icon: React.ReactNode
  displayText: string
  reducedMotion: boolean
}

function SocialLink({ href, label, icon, displayText, reducedMotion }: SocialLinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      {...CURSOR_INTERACTIVE}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: theme.colors.text.secondary,
        textDecoration: 'none',
        fontFamily: theme.fonts.body,
        fontSize: '0.9rem',
        minHeight: '44px', // meets 44×44px minimum tap target requirement
        transition: reducedMotion ? 'none' : 'color 200ms ease, filter 200ms ease',
      }}
      onMouseEnter={e => {
        if (!reducedMotion) {
          const el = e.currentTarget
          el.style.color = theme.colors.gold.primary
          el.style.filter = 'drop-shadow(0 0 6px rgba(232,178,58,0.7))'
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.color = theme.colors.text.secondary
        el.style.filter = ''
      }}
    >
      {icon}
      <span>{displayText}</span>
    </a>
  )
}

// ---------------------------------------------------------------------------
// Contact component
// ---------------------------------------------------------------------------

export function Contact({ reducedMotion }: ContactProps) {
  // ── Scroll reveal (task 10.5) ─────────────────────────────────────────────
  const contentRef = useRef<HTMLDivElement>(null)
  useScrollReveal(contentRef as React.RefObject<HTMLElement | null>, {
    reducedMotion,
    y: 30,
    stagger: 0.12,
    start: 'top 80%',
    duration: 0.6,
  })

  // ── Form state (task 10.1 / 10.2 / 10.3) ─────────────────────────────────
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    message: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Re-validate the field once it's been touched
    if (touched[name as keyof FormState]) {
      setErrors(prev => ({
        ...prev,
        ...validate({ ...form, [name]: value }),
        // Clear this field's error if now valid
      }))
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, ...validate({ ...form, [e.target.name]: e.target.value }) }))
  }

  // task 10.2: submit via mailto, no network requests
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Mark all fields as touched so errors show
    setTouched({ name: true, email: true, message: true })
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const href = buildMailtoHref(form)
    window.location.href = href
  }

  // Shared input style
  // Note: outline is intentionally omitted here — the global :focus-visible
  // rule in index.css provides the gold ring for keyboard users, while the
  // onFocus handler adds the gold border + box-shadow for all users.
  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: theme.colors.accent.ocean,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.accent.oceanMid}`,
    borderRadius: '6px',
    padding: '0.65rem 0.875rem',
    fontFamily: theme.fonts.body,
    fontSize: '0.95rem',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.35rem',
    fontFamily: theme.fonts.body,
    fontSize: '0.85rem',
    fontWeight: 500,
    color: theme.colors.text.secondary,
    letterSpacing: '0.03em',
  }

  const errorStyle: React.CSSProperties = {
    marginTop: '0.3rem',
    fontSize: '0.8rem',
    fontFamily: theme.fonts.body,
    color: '#F2994A', // orange-red for error messages
  }

  const currentYear = new Date().getFullYear()

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="py-20 px-6 md:px-12"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
    >
      {/* ── Scroll-reveal wrapper — direct children animate in (task 10.5) ── */}
      <div ref={contentRef}>

        {/* ── Section heading (task 10.1) ─────────────────────────────────── */}
        <h2
          className="text-3xl md:text-4xl lg:text-5xl mb-12 text-center"
          style={{
            fontFamily: theme.fonts.display,
            color: theme.colors.gold.primary,
            letterSpacing: '0.04em',
          }}
        >
          Send a Message in a Bottle
        </h2>

        {/* ── Two-column layout: form + social links ─────────────────────── */}
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-start">

          {/* ── Contact form (tasks 10.1 / 10.2 / 10.3) ──────────────────── */}
          <div className="max-w-2xl w-full mx-auto lg:mx-0 flex-1">
            <form onSubmit={handleSubmit} noValidate>

              {/* Name field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="contact-name" style={labelStyle}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    borderColor:
                      touched.name && errors.name
                        ? '#F2994A'
                        : theme.colors.accent.oceanMid,
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = theme.colors.gold.primary
                    e.currentTarget.style.boxShadow = `0 0 0 2px rgba(232,178,58,0.2)`
                  }}
                  onBlurCapture={e => {
                    if (!(touched.name && errors.name)) {
                      e.currentTarget.style.borderColor = theme.colors.accent.oceanMid
                    }
                    e.currentTarget.style.boxShadow = ''
                  }}
                  aria-required="true"
                  aria-invalid={!!(touched.name && errors.name)}
                  aria-describedby={touched.name && errors.name ? 'contact-name-error' : undefined}
                  placeholder="Monkey D. Luffy"
                />
                {touched.name && errors.name && (
                  <p id="contact-name-error" role="alert" style={errorStyle}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="contact-email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    borderColor:
                      touched.email && errors.email
                        ? '#F2994A'
                        : theme.colors.accent.oceanMid,
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = theme.colors.gold.primary
                    e.currentTarget.style.boxShadow = `0 0 0 2px rgba(232,178,58,0.2)`
                  }}
                  onBlurCapture={e => {
                    if (!(touched.email && errors.email)) {
                      e.currentTarget.style.borderColor = theme.colors.accent.oceanMid
                    }
                    e.currentTarget.style.boxShadow = ''
                  }}
                  aria-required="true"
                  aria-invalid={!!(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? 'contact-email-error' : undefined}
                  placeholder="luffy@grandline.com"
                />
                {touched.email && errors.email && (
                  <p id="contact-email-error" role="alert" style={errorStyle}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message field */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label htmlFor="contact-message" style={labelStyle}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '120px',
                    borderColor:
                      touched.message && errors.message
                        ? '#F2994A'
                        : theme.colors.accent.oceanMid,
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = theme.colors.gold.primary
                    e.currentTarget.style.boxShadow = `0 0 0 2px rgba(232,178,58,0.2)`
                  }}
                  onBlurCapture={e => {
                    if (!(touched.message && errors.message)) {
                      e.currentTarget.style.borderColor = theme.colors.accent.oceanMid
                    }
                    e.currentTarget.style.boxShadow = ''
                  }}
                  aria-required="true"
                  aria-invalid={!!(touched.message && errors.message)}
                  aria-describedby={
                    touched.message && errors.message ? 'contact-message-error' : undefined
                  }
                  placeholder="Your message sets sail from here…"
                />
                {touched.message && errors.message && (
                  <p id="contact-message-error" role="alert" style={errorStyle}>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit button — gold fill, same style as Hero CTAs (task 10.2) */}
              <button
                type="submit"
                {...CURSOR_INTERACTIVE}
                style={{
                  backgroundColor: theme.colors.gold.primary,
                  color: theme.colors.base.navy,
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.75rem 2rem',
                  minWidth: '48px',
                  minHeight: '48px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: theme.fonts.body,
                  cursor: 'pointer',
                  transition: 'filter 200ms ease, box-shadow 200ms ease',
                }}
                onMouseEnter={e => {
                  if (!reducedMotion) {
                    const btn = e.currentTarget
                    btn.style.filter = 'brightness(1.15)'
                    btn.style.boxShadow = '0 0 12px rgba(232,178,58,0.6)'
                  }
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget
                  btn.style.filter = ''
                  btn.style.boxShadow = ''
                }}
              >
                Cast the Bottle
              </button>
            </form>
          </div>

          {/* ── Social / contact links (task 10.4) ──────────────────────── */}
          <aside
            aria-label="Contact information"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              flexShrink: 0,
              paddingTop: '0.25rem',
            }}
          >
            <p
              style={{
                fontFamily: theme.fonts.body,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: theme.colors.text.secondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: 0,
              }}
            >
              Reach me directly
            </p>

            {/* Email mailto link */}
            <SocialLink
              href={`mailto:${contactInfo.email}`}
              label={`Send email to ${contactInfo.email}`}
              icon={<EmailIcon />}
              displayText={contactInfo.email}
              reducedMotion={reducedMotion}
            />

            {/* GitHub */}
            <SocialLink
              href={contactInfo.github}
              label="GitHub profile"
              icon={<GitHubIcon />}
              displayText="github.com/kailashji24"
              reducedMotion={reducedMotion}
            />

            {/* LinkedIn */}
            <SocialLink
              href={contactInfo.linkedin}
              label="LinkedIn profile"
              icon={<LinkedInIcon />}
              displayText="linkedin.com/in/kailash-chaudhary24"
              reducedMotion={reducedMotion}
            />

            {/* Download Resume — direct file download */}
            <a
              href="/resume.pdf"
              download
              {...CURSOR_INTERACTIVE}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: theme.colors.gold.primary,
                color: theme.colors.base.navy,
                border: 'none',
                borderRadius: '4px',
                padding: '0.65rem 1.25rem',
                minHeight: '44px',
                fontFamily: theme.fonts.body,
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer',
                marginTop: '0.5rem',
                transition: 'filter 200ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={e => {
                if (!reducedMotion) {
                  const el = e.currentTarget
                  el.style.filter = 'brightness(1.15)'
                  el.style.boxShadow = '0 0 12px rgba(232,178,58,0.6)'
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.filter = ''
                el.style.boxShadow = ''
              }}
            >
              {/* Download arrow icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 12L3 7h3V2h4v5h3L8 12z"/>
                <rect x="2" y="13" width="12" height="1.5" rx="0.75"/>
              </svg>
              Download Resume
            </a>
          </aside>
        </div>

        {/* ── Footer (task 10.6) ──────────────────────────────────────────── */}
        <footer
          style={{
            marginTop: '4rem',
            textAlign: 'center',
          }}
        >
          {/* Rope-knot SVG divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                backgroundColor: theme.colors.accent.oceanMid,
                maxWidth: '200px',
              }}
            />
            <RopeKnotSVG />
            <div
              style={{
                flex: 1,
                height: '1px',
                backgroundColor: theme.colors.accent.oceanMid,
                maxWidth: '200px',
              }}
            />
          </div>

          {/* Availability */}
          <p
            style={{
              fontFamily: theme.fonts.body,
              fontSize: '0.9rem',
              color: theme.colors.gold.primary,
              fontWeight: 500,
              marginBottom: '0.5rem',
            }}
          >
            {contactInfo.availability}
          </p>

          {/* Copyright */}
          <p
            style={{
              fontFamily: theme.fonts.body,
              fontSize: '0.8rem',
              color: theme.colors.text.secondary,
              margin: 0,
            }}
          >
            &copy; {currentYear} Kailash Chaudhary
          </p>
        </footer>

      </div>
    </section>
  )
}
