/**
 * Property-based tests for buildMailtoHref
 *
 * Property 3: Contact form never sends data to third parties
 * Validates: Requirements 9.1
 */

import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { buildMailtoHref } from '../utils/mailto'

// Characters that must NOT appear raw (unencoded) in the query string
// (documented for reference; individual characters are checked per test below)

/**
 * Extracts the query string portion from the mailto href (everything after '?')
 */
function getQueryString(href: string): string {
  const qIndex = href.indexOf('?')
  return qIndex === -1 ? '' : href.slice(qIndex + 1)
}

describe('buildMailtoHref — Property 3: Contact form never sends data to third parties', () => {
  it('output always starts with mailto:kailash998955@gmail.com', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 1 }),
        }),
        ({ name, email, message }) => {
          const href = buildMailtoHref({ name, email, message })
          expect(href).toMatch(/^mailto:kailash998955@gmail\.com/)
        }
      ),
      { numRuns: 200 }
    )
  })

  it('query string contains no raw spaces', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 1 }),
        }),
        ({ name, email, message }) => {
          const href = buildMailtoHref({ name, email, message })
          const query = getQueryString(href)
          expect(query).not.toContain(' ')
        }
      ),
      { numRuns: 200 }
    )
  })

  it('query string contains no raw @ signs (all @ must be encoded as %40)', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 1 }),
        }),
        ({ name, email, message }) => {
          const href = buildMailtoHref({ name, email, message })
          const query = getQueryString(href)
          expect(query).not.toContain('@')
        }
      ),
      { numRuns: 200 }
    )
  })

  it('query string contains no raw newlines (newlines must be encoded)', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 1 }),
        }),
        ({ name, email, message }) => {
          const href = buildMailtoHref({ name, email, message })
          const query = getQueryString(href)
          expect(query).not.toContain('\n')
          expect(query).not.toContain('\r')
        }
      ),
      { numRuns: 200 }
    )
  })

  it('all fields are URI-encoded: decoded query contains the original field values', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 1 }),
        }),
        ({ name, email, message }) => {
          const href = buildMailtoHref({ name, email, message })
          const query = getQueryString(href)
          // The full query decoded must contain all original field values
          const decoded = decodeURIComponent(query)
          expect(decoded).toContain(name)
          expect(decoded).toContain(email)
          expect(decoded).toContain(message)
        }
      ),
      { numRuns: 200 }
    )
  })

  it('href is a valid string with subject and body parameters', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          email: fc.emailAddress(),
          message: fc.string({ minLength: 1 }),
        }),
        ({ name, email, message }) => {
          const href = buildMailtoHref({ name, email, message })
          expect(typeof href).toBe('string')
          expect(href.length).toBeGreaterThan(0)
          expect(href).toContain('subject=')
          expect(href).toContain('body=')
        }
      ),
      { numRuns: 200 }
    )
  })
})
