import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import './CardVisual.css'

/**
 * L3 · CardVisual — the payment card visual
 *
 * Sizing contract (Figma):
 *   column · W=fill · H=fixed(224) · pad 20 · space-between
 *   ├ row: brand … kind
 *   ├ row: chip + contactless
 *   └ row: [holder / PAN (last 4)] … expiry
 *   224 at the 358 a phone screen gives it = the ISO card ratio 1.586,
 *   so it reads as a card and not as one more panel.
 *   size=sm — fixed 280×176 (same ratio), pad 16: the card as an object
 *   inside another block (PayMoment).
 *
 * ── What this component does NOT include ──────────────────────────
 * The "Pay with 2.04 ETH" row under the card on Home. It is a payment
 * composer assembled on the screen from ListRow + AssetIcon + Button;
 * merging it into the card would hide two meanings under one name.
 *
 * ── skin ──────────────────────────────────────────────────────────
 * • ball — the brand card, what the screens use: tennis-ball felt with
 *   the ball's seam as its one printed mark. The same in both themes,
 *   like real plastic. It is the one large patch of brand color in the
 *   app, so the UI around it stays neutral.
 * • auto — follows the app theme via --card-bg.
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

/* The seam of a tennis ball: two arcs, as if the ball were unrolled
   across the card. They keep clear of the printed text — the bottom
   arch rises between the number and the expiry. Drawn twice — a soft groove under a light line —
   so it reads as stitched rubber, not as a stroke. */
const SEAM = [
  'M212 -24 C224 104 322 160 382 38',
  'M146 252 C164 162 256 162 274 252',
]

function Seam() {
  return (
    <svg className="CardVisual__seam" width="100%" height="100%" viewBox="0 0 358 224" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {SEAM.map((d) => <path key={`g${d}`} d={d} className="CardVisual__groove" />)}
      {SEAM.map((d) => <path key={`s${d}`} d={d} className="CardVisual__stitch" />)}
    </svg>
  )
}

const STATE_NOTE = {
  frozen: 'Frozen',
  expired: 'Expired',
}

export function CardVisual({
  skin = 'ball',
  size = 'md',
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
    size === 'sm' && 'CardVisual--sm',
    state !== 'active' && `is-${state}`,
    className,
  ].filter(Boolean).join(' ')

  // Only the last four, the way modern cards print it: a full masked
  // number is sixteen characters of noise.
  const pan = masked ? `•••• ${last4}` : `4242 4242 4242 ${last4}`

  return (
    <div className={cls} {...rest}>
      <div className="CardVisual__glow" aria-hidden="true" />
      {skin === 'ball' && <Seam />}

      <div className="CardVisual__top">
        <span className="CardVisual__brand">tenni</span>
        <span className="CardVisual__kind">{KIND_LABEL[kind] || KIND_LABEL.debit}</span>
      </div>

      <div className="CardVisual__chipRow">
        <span className="CardVisual__chip" aria-hidden="true" />
        <Icon name="contactless" size={20} tone="inherit" />
      </div>

      <div className="CardVisual__foot">
        <div className="CardVisual__id">
          {holder && <span className="CardVisual__holder">{holder}</span>}
          <span className="CardVisual__pan">{pan}</span>
        </div>
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
