// src/components/Contact.tsx
// "Message in a Bottle" — direct contact links first (email with a one-click
// copy, GitHub, LinkedIn, resume), plus a short form that opens the visitor's
// mail app. The copy button matters: mailto: silently does nothing for people
// who only use webmail.

import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { buildMailtoHref } from '../utils/mailto'
import { contactInfo, profile } from '../data/index'
import { CURSOR_INTERACTIVE } from '../utils/cursorInteractive'
import { SectionHeading } from './SectionHeading'

interface ContactProps {
  reducedMotion: boolean
}

interface FormState {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(fields: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!fields.name.trim()) errors.name = 'Please add your name.'
  if (!fields.email.trim()) errors.email = 'Please add your email.'
  else if (!EMAIL_RE.test(fields.email.trim())) errors.email = 'That email address looks incomplete.'
  if (!fields.message.trim()) errors.message = 'Please write a short message.'
  return errors
}

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, '')

// ── Icons ────────────────────────────────────────────────────────────────────

const iconProps = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true } as const

const EmailIcon = () => (
  <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const GitHubIcon = () => (
  <svg {...iconProps} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.025 10.025 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg {...iconProps} fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const RopeKnot = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#9DB0C4" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M6 12 C6 7, 1 7, 1 12 C1 17, 6 17, 6 12 C6 9, 9 8, 12 12" />
    <path d="M18 12 C18 7, 23 7, 23 12 C23 17, 18 17, 18 12 C18 9, 15 8, 12 12" />
    <path d="M9 10 C10 11, 11 11.5, 12 12" />
    <path d="M12 12 C13 12.5, 14 13, 15 14" />
    <path d="M9 14 C10 13, 11 12.5, 11.4 12.2" />
    <path d="M12.6 11.8 C13 11.5, 14 11, 15 10" />
  </svg>
)

// ── Component ────────────────────────────────────────────────────────────────

export function Contact({ reducedMotion }: ContactProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  useScrollReveal(contentRef, { reducedMotion, stagger: 0.12 })

  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    message: false,
  })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(id)
  }, [copied])

  function update(name: keyof FormState, value: string) {
    const next = { ...form, [name]: value }
    setForm(next)
    if (touched[name]) setErrors(validate(next))
  }

  function handleBlur(name: keyof FormState) {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors(validate(form))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    window.location.href = buildMailtoHref(form)
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactInfo.email)
      setCopied(true)
    } catch {
      // Clipboard blocked — fall back to opening the mail app
      window.location.href = `mailto:${contactInfo.email}`
    }
  }

  const fieldError = (name: keyof FormState) => (touched[name] ? errors[name] : undefined)

  const fields: { name: keyof FormState; label: string; type?: string; autoComplete?: string; placeholder: string; multiline?: boolean }[] = [
    { name: 'name', label: 'Name', autoComplete: 'name', placeholder: 'Your name' },
    { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@company.com' },
    { name: 'message', label: 'Message', placeholder: 'Role, team, or just a hello…', multiline: true },
  ]

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section"
      style={{ backgroundColor: 'var(--bg-navy-deep)' }}
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Contact" title="Message in a Bottle" id="contact-title" />

        <div ref={contentRef} className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* ── Direct contact ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <p className="m-0 text-base leading-relaxed text-textPrimary">
              Hiring for a Cloud, DevOps or backend role? The fastest way to reach me is email.
            </p>

            <div className="card flex flex-col gap-3 p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Email</span>
              <a
                href={`mailto:${contactInfo.email}`}
                {...CURSOR_INTERACTIVE}
                className="link-gold break-all text-base"
              >
                <EmailIcon />
                {contactInfo.email}
              </a>
              <button type="button" onClick={copyEmail} {...CURSOR_INTERACTIVE} className="btn-outline btn-sm self-start">
                {copied ? 'Copied ✓' : 'Copy email address'}
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>

            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              <li>
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" {...CURSOR_INTERACTIVE} className="link-gold text-sm text-textSecondary">
                  <LinkedInIcon />
                  {stripProtocol(contactInfo.linkedin)}
                </a>
              </li>
              <li>
                <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" {...CURSOR_INTERACTIVE} className="link-gold text-sm text-textSecondary">
                  <GitHubIcon />
                  {stripProtocol(contactInfo.github)}
                </a>
              </li>
            </ul>

            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" {...CURSOR_INTERACTIVE} className="btn-primary self-start">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 12L3 7h3V2h4v5h3L8 12z" />
                <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
              </svg>
              View Resume (PDF)
            </a>
          </div>

          {/* ── Form ───────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate className="card flex flex-col gap-5 p-6 md:p-8" aria-describedby="form-note">
            {fields.map((f) => {
              const err = fieldError(f.name)
              const id = `contact-${f.name}`
              const common = {
                id,
                name: f.name,
                value: form[f.name],
                placeholder: f.placeholder,
                className: 'field',
                'aria-required': true,
                'aria-invalid': Boolean(err),
                'aria-describedby': err ? `${id}-error` : undefined,
                onBlur: () => handleBlur(f.name),
              }
              return (
                <div key={f.name}>
                  <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-textSecondary">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea {...common} rows={5} className="field min-h-[120px] resize-y" onChange={(e) => update(f.name, e.target.value)} />
                  ) : (
                    <input {...common} type={f.type ?? 'text'} autoComplete={f.autoComplete} onChange={(e) => update(f.name, e.target.value)} />
                  )}
                  {err && (
                    <p id={`${id}-error`} role="alert" className="mb-0 mt-1.5 text-sm text-[#F5A397]">
                      {err}
                    </p>
                  )}
                </div>
              )
            })}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button type="submit" {...CURSOR_INTERACTIVE} className="btn-primary">
                Cast the Bottle
              </button>
              <p id="form-note" className="m-0 text-xs text-textSecondary">
                Opens your email app with the message ready to send.
              </p>
            </div>
          </form>
        </div>

        <footer className="mt-20 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px max-w-[200px] flex-1 bg-oceanMid" />
            <RopeKnot />
            <div className="h-px max-w-[200px] flex-1 bg-oceanMid" />
          </div>
          <p className="mb-2 text-sm font-medium text-gold">{profile.availability}</p>
          <p className="m-0 text-xs text-textSecondary">
            © {new Date().getFullYear()} {profile.name} · Built with React, TypeScript and GSAP
          </p>
        </footer>
      </div>
    </section>
  )
}
