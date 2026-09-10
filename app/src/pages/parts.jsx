import { Text } from '../ui/index.js'

/** Catalog chrome: section, example card, labeled cell. */

export function Section({ title, hint, children }) {
  return (
    <section className="Section">
      {(title || hint) && (
        <div className="Section__head">
          {/* title is optional: a page whose header already names it
              doesn't repeat the same word as its first section title. */}
          {title && <Text variant="h2">{title}</Text>}
          {hint && <Text variant="bodySm" tone="dim">{hint}</Text>}
        </div>
      )}
      {children}
    </section>
  )
}

export function Spec({ title, contract, column = false, children }) {
  return (
    <div className="Spec">
      <div className="Spec__head">
        <Text variant="title">{title}</Text>
        {contract && <Text variant="mono" tone="faint">{contract}</Text>}
      </div>
      <div className={`Spec__body${column ? ' Spec__body--column' : ''}`}>{children}</div>
    </div>
  )
}

export function Cell({ label, center = false, children }) {
  return (
    <div className={`Cell${center ? ' Cell--center' : ''}`}>
      {children}
      {label && <span className="Cell__label">{label}</span>}
    </div>
  )
}
