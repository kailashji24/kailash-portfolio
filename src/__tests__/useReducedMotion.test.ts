/**
 * Property-based tests for useReducedMotion hook
 *
 * Property 1: Reduced motion always respected
 *   For any value of `matches` returned by window.matchMedia,
 *   the hook must return exactly that boolean.
 *
 * Validates: Requirements 2.6, 11.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import * as fc from 'fast-check'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** Helper: build a minimal MediaQueryList mock for the given `matches` value */
function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []

  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: vi.fn((_type: string, fn: (e: MediaQueryListEvent) => void) => {
      listeners.push(fn)
    }),
    removeEventListener: vi.fn((_type: string, fn: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(fn)
      if (idx !== -1) listeners.splice(idx, 1)
    }),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList

  return mql
}

describe('useReducedMotion', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    vi.restoreAllMocks()
  })

  /**
   * Property 1: Reduced motion always respected
   *
   * For every boolean value of `matches`, the hook must return that exact value.
   * fast-check explores both `true` and `false` (and any boolean produced by the
   * arbitrary), confirming the mapping is identity — no inversion, no clamping.
   */
  it('Property 1: always returns the boolean reported by matchMedia (Validates: Requirements 2.6, 11.4)', () => {
    fc.assert(
      fc.property(fc.boolean(), (matches) => {
        // Arrange — install mock before rendering so the useState initializer sees it
        window.matchMedia = vi.fn().mockReturnValue(mockMatchMedia(matches))

        // Act
        const { result } = renderHook(() => useReducedMotion())

        // Assert — hook return value must exactly equal the mocked `matches`
        expect(result.current).toBe(matches)
      }),
      { numRuns: 50 },
    )
  })
})
