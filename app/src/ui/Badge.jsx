import './Badge.css'

/**
 * L2 · Badge
 *
 * Sizing contract (Figma): W=hug(min 18) H=fixed(18) · pad 0/5
 *
 * Component Properties: variant — Variant: dot count · tone — accent danger
 *
 * ⚠ Badge is a standalone visual (number or dot), but positioning it
 * over an icon is the PARENT's is-abs (see IconButton.css
 * .IconButton__badge). Badge itself never leaves the flow.
 */
export function Badge({ variant = 'dot', tone = 'danger', count, className = '', ...rest }) {
  const cls = ['Badge', `Badge--${variant}`, `Badge--${tone}`, className].filter(Boolean).join(' ')

  if (variant === 'dot') {
    return <span className={cls} aria-hidden="true" {...rest} />
  }

  const display = count > 99 ? '99+' : String(count)
  return (
    <span className={cls} {...rest}>
      {display}
    </span>
  )
}
