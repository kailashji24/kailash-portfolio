// src/hooks/useTypingAnimation.ts
// Cycling typing + deleting animation hook.
// Types each phrase character-by-character, pauses, then deletes before
// moving to the next phrase. Loops indefinitely.
//
// Loop invariants:
//   - currentIndex is always in [0, phrases.length - 1]
//   - displayText is always a prefix of phrases[currentIndex]
//   - During delete phase, displayText.length strictly decreases each step
//
// Cleanup: AbortController is aborted on unmount, stopping all pending timers.

import { useState, useEffect, useRef } from 'react'

export interface TypingAnimationResult {
  /** The currently displayed text — always a prefix of the current phrase */
  displayText: string
  /** True while characters are being added; false while deleting or pausing */
  isTyping: boolean
}

export interface TypingAnimationOptions {
  /** Milliseconds per character when typing. Default: 80 */
  typeSpeed?: number
  /** Milliseconds per character when deleting. Default: 40 */
  deleteSpeed?: number
  /** Milliseconds to pause at the end of a fully-typed phrase. Default: 1800 */
  pauseDuration?: number
  /** If true, returns all phrases as a static comma-separated string (no animation) */
  reducedMotion?: boolean
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const id = setTimeout(() => resolve(), ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(id)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true }
    )
  })
}

async function runTypingLoop(
  phrases: string[],
  setText: (s: string) => void,
  setIsTyping: (b: boolean) => void,
  options: Required<Omit<TypingAnimationOptions, 'reducedMotion'>>,
  signal: AbortSignal
): Promise<void> {
  let index = 0
  // Loop invariant: index in [0, phrases.length - 1]
  while (!signal.aborted) {
    const current = phrases[index]

    // Type phase: append characters one at a time
    setIsTyping(true)
    for (let i = 1; i <= current.length; i++) {
      if (signal.aborted) return
      setText(current.slice(0, i))
      try {
        await sleep(options.typeSpeed, signal)
      } catch {
        return
      }
    }

    // Pause at full phrase
    setIsTyping(false)
    try {
      await sleep(options.pauseDuration, signal)
    } catch {
      return
    }

    // Delete phase: remove characters one at a time
    for (let i = current.length - 1; i >= 0; i--) {
      if (signal.aborted) return
      setText(current.slice(0, i))
      try {
        await sleep(options.deleteSpeed, signal)
      } catch {
        return
      }
    }

    // Advance to next phrase (wrap around)
    index = (index + 1) % phrases.length
  }
}

export function useTypingAnimation(
  phrases: string[],
  options: TypingAnimationOptions = {}
): TypingAnimationResult {
  const {
    typeSpeed = 80,
    deleteSpeed = 40,
    pauseDuration = 1800,
    reducedMotion = false,
  } = options

  const [displayText, setDisplayText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return

    // Create a new AbortController for this effect instance
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Start the typing loop
    runTypingLoop(
      phrases,
      setDisplayText,
      setIsTyping,
      { typeSpeed, deleteSpeed, pauseDuration },
      controller.signal
    ).catch(() => {
      // AbortError is expected on unmount — swallow it silently
    })

    return () => {
      // Abort the loop and clear all pending timers on unmount
      controller.abort()
      abortControllerRef.current = null
    }
  }, [phrases, typeSpeed, deleteSpeed, pauseDuration, reducedMotion])

  // Under reduced motion: return all phrases joined, no animation
  if (reducedMotion) {
    return { displayText: phrases.join(', '), isTyping: false }
  }

  return { displayText, isTyping }
}
