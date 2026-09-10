import './Text.css'

/**
 * L1 · Text
 *
 * The only way to render text. Guarantees the system has no stray
 * font sizes — only the 10 styles of the type scale.
 *
 * Sizing contract (Figma):
 *   W=hug (or fill via prop) · H=hug · pad 0 · margin 0
 *   truncate → Figma: Truncate text
 */

const TAG_BY_VARIANT = {
  display: 'h1', h1: 'h1', h2: 'h2', h3: 'h3',
  title: 'p', body: 'p', bodySm: 'p', label: 'span', caption: 'span', mono: 'span',
}

export function Text({
  variant = 'body',
  tone = 'default',
  align,
  truncate = false,
  numeric = false,
  fill = false,
  as,
  className = '',
  children,
  ...rest
}) {
  const Tag = as || TAG_BY_VARIANT[variant] || 'span'

  const cls = [
    'Text',
    `Text--${variant}`,
    `Text--${tone}`,
    align && `Text--align-${align}`,
    truncate && 'is-truncate',
    numeric && 'tabular',
    fill && 'Text--fill',
    className,
  ].filter(Boolean).join(' ')

  return <Tag className={cls} {...rest}>{children}</Tag>
}
