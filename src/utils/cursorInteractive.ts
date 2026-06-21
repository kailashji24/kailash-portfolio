/**
 * cursorInteractive.ts
 *
 * Shared helper for the custom cursor interactive-element protocol.
 *
 * Usage
 * -----
 * Spread `{...CURSOR_INTERACTIVE}` onto any anchor, button, or card element
 * that should trigger the cursor's expanded/filled hover state:
 *
 *   <a href="/about" {...CURSOR_INTERACTIVE}>About Me</a>
 *   <button {...CURSOR_INTERACTIVE}>Send</button>
 *   <div role="button" {...CURSOR_INTERACTIVE}>Project Card</div>
 *
 * The CustomCursor component watches for `[data-cursor="interactive"]` in the
 * DOM (including elements added after initial mount, via MutationObserver) and
 * scales the cursor ring to 2.5× on mouseenter.
 */

/** Spread this onto any interactive element to opt it into the cursor effect. */
export const CURSOR_INTERACTIVE = { 'data-cursor': 'interactive' } as const
