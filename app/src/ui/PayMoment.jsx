import { Icon } from '../icons/Icon.jsx'
import { CardVisual } from './CardVisual.jsx'
import './PayMoment.css'

/**
 * L4 · PayMoment — the card at the moment of payment
 *
 * The one moment the whole product is about, so it gets its own motion
 * instead of a generic spinner and check:
 *   • processing — the card hovers, contactless waves ripple out from
 *     behind it: "talking to the terminal";
 *   • success    — the waves stop and the card bounces once, like a
 *     ball off the court; a check pops on its edge;
 *   • declined   — the card flinches sideways and dulls; a cross.
 * With prefers-reduced-motion everything is static: the badge alone
 * carries the outcome.
 *
 * Sizing contract (Figma):
 *   W=fixed(320) H=fixed(240) · the card (CardVisual sm, 280×176) centered
 *   ├ waves  — 3 rings, Absolute position, centered behind the card
 *   └ badge  — 48 circle, Absolute position across the card's right edge
 * In Figma: three variants (State) connected with Smart Animate.
 *
 * props: state (processing|success|declined), last4
 */
export function PayMoment({ state = 'processing', last4 = '4291', className = '', ...rest }) {
  const cls = ['PayMoment', `PayMoment--${state}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      <div className="PayMoment__waves" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="PayMoment__card">
        <CardVisual skin="ball" size="sm" holder="" last4={last4} />
        {state !== 'processing' && (
          <span className="PayMoment__badge" aria-hidden="true">
            <Icon name={state === 'success' ? 'check' : 'close'} size={24} tone="inherit" />
          </span>
        )}
      </div>
    </div>
  )
}
