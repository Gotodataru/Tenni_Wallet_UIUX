import { Text } from './Text.jsx'
import { Button } from './Button.jsx'
import './Section.css'

/**
 * L5 · Section — a screen section (not the catalog's `Section` in
 * pages/parts.jsx: that one is documentation chrome, this one is a
 * design-system component for real screens)
 *
 * Sizing contract (Figma):
 *   column · W=fill H=hug · gap 12
 *   ├ header  row · space-between: Text/h3 + Button/ghost
 *   └ content fill
 *
 * props: title, action (bool), actionLabel, onAction, padding (0|16), children
 */
export function Section({ title, action = false, actionLabel = 'See all', onAction, padding = 0, children, className = '', ...rest }) {
  const cls = ['Section', `Section--pad-${padding}`, className].filter(Boolean).join(' ')

  return (
    <section className={cls} {...rest}>
      {(title || action) && (
        <div className="Section__header">
          {title && <Text variant="h3" fill truncate>{title}</Text>}
          {action && <Button variant="ghost" size="sm" iconTrailing="chevron-right" onClick={onAction}>{actionLabel}</Button>}
        </div>
      )}
      <div className="Section__content">{children}</div>
    </section>
  )
}
