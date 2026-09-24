import { CardVisual } from './CardVisual.jsx'
import './CardStage.css'

/**
 * L4 · CardStage — the card as the hero of a screen (onboarding welcome)
 *
 * The card, a little tilted, under a soft ball-colored light — a court
 * lamp, not a glow on every surface. On mount it drops in and settles
 * with one bounce, the same ball motion as PayMoment's success. Static
 * under prefers-reduced-motion.
 *
 * Sizing contract (Figma):
 *   column · W=fill H=fixed(300) · center
 *   ├ light — Absolute position, behind
 *   └ CardVisual (md, W=fill) rotated −6°
 *
 * props: holder, last4
 */
export function CardStage({ holder, last4, className = '', ...rest }) {
  return (
    <div className={['CardStage', className].filter(Boolean).join(' ')} {...rest}>
      <span className="CardStage__light" aria-hidden="true" />
      <div className="CardStage__card">
        <CardVisual skin="ball" kind="debit" holder={holder} last4={last4} />
      </div>
    </div>
  )
}
