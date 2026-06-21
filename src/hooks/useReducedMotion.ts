// src/hooks/useReducedMotion.ts
// Reactive hook for prefers-reduced-motion media query.
// Returns true when the user has requested reduced motion via OS settings.
// Updates reactively when the OS setting changes — no page reload needed.

import { useState, useEffect } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    // SSR guard — window not available in server environments
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(QUERY)

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches)
    }

    // Use addEventListener for modern browsers (addEventListener on MediaQueryList)
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup: remove listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return reducedMotion
}
