// src/components/SectionHeading.tsx
// One heading style for every section: a plain-language eyebrow label that
// skimmers (and recruiters) scan for, above the themed nautical title.

interface SectionHeadingProps {
  /** Plain label, e.g. "Experience" */
  eyebrow: string
  /** Themed title, e.g. "The Logbook" */
  title: string
  /** id of the <h2>, referenced by the section's aria-labelledby */
  id: string
}

export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div className="mb-12 text-center md:mb-14">
      <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.25em] text-textSecondary">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-display text-3xl uppercase tracking-[0.12em] text-gold sm:text-4xl"
      >
        {title}
      </h2>
    </div>
  )
}
