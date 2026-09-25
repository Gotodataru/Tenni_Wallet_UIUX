import './PinDots.css'

/**
 * L2 · PinDots — how many digits of a passcode are in
 *
 * Sizing contract (Figma): row · W=hug H=fixed(12) · gap 16
 * Component Properties: length — Variant: 4 6
 *                        filled — Number (0…length)
 *                        state  — Variant: default error success
 *
 * The digits themselves are never shown — only how many there are,
 * the way every phone lock screen does it. error shakes the row once
 * and turns it red; the screen clears the digits after, so the user
 * starts again instead of hunting for the wrong one.
 *
 * Not ProgressDots: those say "step 2 of 5" (one active dot), these say
 * "4 of 6 digits typed" (every dot up to N filled).
 */
export function PinDots({ length = 6, filled = 0, state = 'default', className = '' }) {
  const cls = ['PinDots', state !== 'default' && `is-${state}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} role="status" aria-label={`${filled} of ${length} digits entered`}>
      {Array.from({ length }, (_, i) => (
        <span key={i} className={`PinDots__dot${i < filled ? ' is-filled' : ''}`} />
      ))}
    </div>
  )
}
