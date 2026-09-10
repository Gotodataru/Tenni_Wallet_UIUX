import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import './CardVisual.css'

/**
 * L3 · CardVisual — the payment card visual
 *
 * Sizing contract (Figma):
 *   column · W=fill · H=fixed(200) · pad 20 · space-between
 *   ├ row: chip + contactless … kind
 *   ├ PAN (mono, groups of 4)
 *   └ row: holder … expiry
 *
 * ── What this component does NOT include ──────────────────────────
 * On Home the "card" is TWO stacked things: the card and the glass
 * "Pay with 2.04 ETH" panel in front of it. Only the card is a
 * component. The panel is a payment composer assembled on the screen
 * from Surface glass + Text + Chip + Button; merging the two would
 * hide two meanings under one name. Stacking them is the screen's job
 * too (`Layer`): in Figma, two instances with the top one set to
 * Absolute position.
 *
 * ── skin ──────────────────────────────────────────────────────────
 * • auto (default) — follows the app theme via --card-bg. This is
 *   what the screens use.
 * • dark / light — fixed plastic, INDEPENDENT of the UI theme (a dark
 *   card stays dark in a light app). For showing cards to choose from.
 * • glass — a glass variant over other content.
 *
 * ── kind ──────────────────────────────────────────────────────────
 * The corner shows the card TYPE — DEBIT / CREDIT / PREPAID — the way
 * real cards print it. Not a network mark: the word VISA itself is a
 * trademark, and printing it on the card would claim that Tenni issues
 * cards on that network — a partnership that doesn't exist. Mentioning
 * "Visa or Mastercard" in screen TEXT (which cards the wallet works
 * with) is plain descriptive use and stays.
 */

const KIND_LABEL = { debit: 'DEBIT', credit: 'CREDIT', prepaid: 'PREPAID' }

const STATE_NOTE = {
  frozen: 'Frozen',
  expired: 'Expired',
}

export function CardVisual({
  skin = 'auto',
  kind = 'debit',
  last4 = '4291',
  holder = 'NINA ROSS',
  expiry = '12/29',
  masked = true,
  state = 'active',
  className = '',
  ...rest
}) {
  const cls = [
    'CardVisual',
    `CardVisual--${skin}`,
    state !== 'active' && `is-${state}`,
    className,
  ].filter(Boolean).join(' ')

  const pan = masked ? `•••• •••• •••• ${last4}` : `4242 4242 4242 ${last4}`

  return (
    <div className={cls} {...rest}>
      <div className="CardVisual__glow" aria-hidden="true" />

      <div className="CardVisual__top">
        <div className="CardVisual__chipRow">
          <span className="CardVisual__chip" aria-hidden="true" />
          <Icon name="contactless" size={20} tone="inherit" />
        </div>
        <span className="CardVisual__kind">{KIND_LABEL[kind] || KIND_LABEL.debit}</span>
      </div>

      <span className="CardVisual__pan">{pan}</span>

      <div className="CardVisual__foot">
        <span className="CardVisual__holder">{holder}</span>
        <span className="CardVisual__expiry">{expiry}</span>
      </div>

      {state !== 'active' && (
        <div className="CardVisual__veil">
          <Icon name={state === 'frozen' ? 'lock' : 'clock'} size={20} tone="inherit" />
          <Text variant="label">{STATE_NOTE[state]}</Text>
        </div>
      )}
    </div>
  )
}
