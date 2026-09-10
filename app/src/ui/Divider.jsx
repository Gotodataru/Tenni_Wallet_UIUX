import './Divider.css'

/**
 * L1 · Divider
 * Sizing contract (Figma): row · W=fill · H=fixed(1) · pad 0
 * inset — left offset so the line starts after an avatar (0 / 16 / 56)
 */
export function Divider({ inset = 0, className = '' }) {
  return <div className={['Divider', `Divider--inset-${inset}`, className].filter(Boolean).join(' ')} role="separator" />
}
