import './Stack.css'

/**
 * L1 · Stack — a direct twin of Figma Auto Layout
 *
 * Not a utility but a guarantee that layout is done ONLY with what
 * Figma has: direction + gap + padding + alignment. No margin, no
 * grid.
 *
 * props:
 *   dir     — row | column                    → Auto Layout direction
 *   gap     — 0 2 4 6 8 12 16 20 24 32 40 48 64  → Gap between items
 *   pad     — same scale, or 'N M' (vertical horizontal) → Padding
 *   align   — start | center | end | stretch | baseline → Align items
 *   justify — start | center | end | between | around   → Justify
 *   wrap    — bool                            → Auto Layout wrap
 *   fill    — bool  → Fill container (flex:1 1 0)
 *   fillCross — bool → align-self: stretch
 */
export function Stack({
  dir = 'column',
  gap = 0,
  pad,
  align,
  justify,
  wrap = false,
  fill = false,
  fillCross = false,
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}) {
  const padValue = pad === undefined
    ? undefined
    : String(pad).trim().split(/\s+/).map((v) => `var(--space-${v})`).join(' ')

  const cls = [
    'Stack',
    `Stack--${dir}`,
    `Stack--gap-${gap}`,
    align && `Stack--align-${align}`,
    justify && `Stack--justify-${justify}`,
    wrap && 'Stack--wrap',
    fill && 'Stack--fill',
    fillCross && 'Stack--fillCross',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag className={cls} style={padValue ? { padding: padValue, ...style } : style} {...rest}>
      {children}
    </Tag>
  )
}
