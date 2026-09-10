import './HomeIndicator.css'

/**
 * L5 · HomeIndicator
 *
 * Sizing contract (Figma): row · W=fill H=fixed(34) · center
 * props: theme (dark|light) — same logic as StatusBar: the color must
 * read on the screen content, not follow the semantic --fg-default.
 */
export function HomeIndicator({ theme = 'dark', className = '', ...rest }) {
  const cls = ['HomeIndicator', `HomeIndicator--${theme}`, className].filter(Boolean).join(' ')
  return (
    <div className={cls} {...rest}>
      <span className="HomeIndicator__bar" aria-hidden="true" />
    </div>
  )
}
