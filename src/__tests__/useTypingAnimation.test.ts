/**
 * Property-based tests for useTypingAnimation hook
 *
 * Property 2: Typing animation completeness
 *   For any non-empty array of non-empty strings:
 *   - `displayText` is always a prefix of one of the phrases in the array
 *   - `currentIndex` stays in [0, phrases.length - 1]
 *   - `displayText.length` stays in [0, phrases[currentIndex].length]
 *
 *   Since the hook does not expose `currentIndex` directly, we verify that
 *   `displayText` is a prefix of *some* phrase — which implicitly guarantees the
 *   index/length invariants hold for that phrase.
 *
 * Validates: Requirements 3.3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import * as fc from 'fast-check'
import { useTypingAnimation } from '../hooks/useTypingAnimation'

/** Returns true when `text` is a prefix (including empty string) of `phrase`. */
function isPrefix(text: string, phrase: string): boolean {
  return phrase.startsWith(text)
}

/** Returns true when `text` is a prefix of at least one phrase in the array. */
function isPrefixOfSome(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => isPrefix(text, phrase))
}

describe('useTypingAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  /**
   * Property 2: Typing animation completeness
   *
   * At every observable point in time, `displayText` must be a prefix of one
   * of the phrases supplied.  We advance fake timers in incremental steps and
   * sample the hook's output after each advancement, asserting the prefix
   * invariant holds continuously.
   *
   * Validates: Requirements 3.3
   */
  it('Property 2: displayText is always a prefix of one of the phrases (Validates: Requirements 3.3)', () => {
    fc.assert(
      fc.property(
        // Generate a non-empty array of non-empty strings
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
        (phrases) => {
          // Use fast, deterministic speeds so the test runs quickly
          const typeSpeed = 10
          const deleteSpeed = 5
          const pauseDuration = 20

          const { result, unmount } = renderHook(() =>
            useTypingAnimation(phrases, { typeSpeed, deleteSpeed, pauseDuration }),
          )

          // The initial displayText must satisfy the invariant (empty string is a
          // prefix of every phrase, so this always holds at mount time).
          expect(isPrefixOfSome(result.current.displayText, phrases)).toBe(true)

          // Advance through enough timer ticks to cover at least one full
          // type-pause-delete cycle for the longest phrase.
          const longestPhraseLength = Math.max(...phrases.map((p) => p.length))
          // Budget: type all chars + pause + delete all chars, with some extra margin
          const oneCycleDuration =
            longestPhraseLength * typeSpeed + pauseDuration + longestPhraseLength * deleteSpeed + 50

          // Sample the invariant at multiple points during the animation
          const stepMs = 5
          const totalSteps = Math.ceil(oneCycleDuration / stepMs)

          for (let step = 0; step < totalSteps; step++) {
            act(() => {
              vi.advanceTimersByTime(stepMs)
            })

            const { displayText } = result.current

            // Core invariant: displayText must always be a prefix of some phrase
            expect(
              isPrefixOfSome(displayText, phrases),
              `After ${(step + 1) * stepMs}ms: "${displayText}" is not a prefix of any phrase in [${phrases.map((p) => JSON.stringify(p)).join(', ')}]`,
            ).toBe(true)

            // Length invariant: displayText cannot be longer than the longest phrase
            expect(displayText.length).toBeLessThanOrEqual(longestPhraseLength)
          }

          // Clean up the hook (aborts the async loop)
          unmount()
        },
      ),
      { numRuns: 50 },
    )
  })

  it('Property 2 (edge case): initial displayText is always a prefix of some phrase', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
        (phrases) => {
          const { result, unmount } = renderHook(() =>
            useTypingAnimation(phrases, { typeSpeed: 10, deleteSpeed: 5, pauseDuration: 20 }),
          )

          // Immediately after mount, displayText is either '' (initial state) or the
          // first character of phrases[0] — React 19 flushes the first effect tick
          // synchronously inside act(). Either way, the prefix invariant must hold.
          expect(
            isPrefixOfSome(result.current.displayText, phrases),
            `At mount: "${result.current.displayText}" is not a prefix of any phrase in [${phrases.map((p) => JSON.stringify(p)).join(', ')}]`,
          ).toBe(true)

          unmount()
        },
      ),
      { numRuns: 30 },
    )
  })
})
