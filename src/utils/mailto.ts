// src/utils/mailto.ts
// Utility for building a mailto: URI from the contact form state.
//
// No network requests are made — this opens the user's default mail client.
// All field values are URI-encoded via encodeURIComponent to handle
// special characters safely.
//
// Correctness property (P3):
//   For any valid ContactFormState, buildMailtoHref always returns a string
//   that starts with 'mailto:kailash998955@gmail.com' and contains no
//   raw spaces, '@', or unencoded special characters in the query string.

const RECIPIENT = 'kailash998955@gmail.com'

export interface ContactFormState {
  name: string
  email: string
  message: string
}

/**
 * Builds a mailto: URI from the contact form fields.
 *
 * @param state - The form state with name, email, and message
 * @returns A properly URI-encoded mailto: href string
 *
 * @example
 * buildMailtoHref({ name: 'Alice', email: 'a@b.com', message: 'Hello!' })
 * // => 'mailto:kailash998955@gmail.com?subject=Portfolio%20Contact%20from%20Alice&body=From%3A%20Alice%0AEmail%3A%20a%40b.com%0A%0AHello!'
 */
export function buildMailtoHref(state: ContactFormState): string {
  const subject = encodeURIComponent(`Portfolio Contact from ${state.name}`)
  const body = encodeURIComponent(
    `From: ${state.name}\nEmail: ${state.email}\n\n${state.message}`
  )
  return `mailto:${RECIPIENT}?subject=${subject}&body=${body}`
}
