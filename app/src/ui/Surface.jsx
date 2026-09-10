import './Surface.css'

/**
 * L1 · Surface — the base surface (card)
 *
 * Sizing contract (Figma):
 *   column · W=fill · H=hug (fill → H=fill) · pad 16 · gap 12
 *   level → Fill + Effect (shadow) · glass → Background blur
 *
 * fill (bool) — Fill container on the parent's main axis. The glass in
 * `Layer anchor="stack"` needs it: the panel must match the card under
 * it, not the height of its own content.
 */
export function Surface({
  level = 1,
  radius = 'lg',
  glass = false,
  fill = false,
  interactive = false,
  pad = 16,
  gap = 12,
  dir = 'column',
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}) {
  const cls = [
    'Surface',
    `Surface--l${level}`,
    `Surface--r-${radius}`,
    `Surface--${dir}`,
    glass && 'Surface--glass',
    fill && 'Surface--fill',
    interactive && 'Surface--interactive',
    className,
  ].filter(Boolean).join(' ')

  const inline = {
    padding: `var(--space-${pad})`,
    gap: `var(--space-${gap})`,
    ...style,
  }

  return <Tag className={cls} style={inline} {...rest}>{children}</Tag>
}
