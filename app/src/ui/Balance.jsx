import { useState } from 'react'
import { Text } from './Text.jsx'
import { IconButton } from './IconButton.jsx'
import { Amount } from './Amount.jsx'
import { Skeleton } from './Skeleton.jsx'
import './Balance.css'

/**
 * L3 · Balance
 *
 * Sizing contract (Figma):
 *   column · W=hug H=hug · gap 6 · align center
 *   ├ row: label + IconButton(eye)
 *   ├ Text/display — amount; the cents in fg-dim, so the eye reads
 *   │   the dollars first
 *   └ row: Amount(delta %) + Text/bodySm dim (gain · period)
 *
 * props: value, currency, masked (bool, controlled or uncontrolled —
 *        like Toggle), loading (bool), delta (percent, number|undefined),
 *        gain (money over the period, number|undefined), period (string),
 *        align (center|start)
 *
 * align="start" — the balance as the screen header, left, with the
 * avatar on the right (Home). center — a standalone centered block.
 */
const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function Balance({
  label = 'Total balance',
  value,
  align = 'center',
  currency = '$',
  masked: maskedProp,
  defaultMasked = false,
  onToggleMask,
  loading = false,
  delta,
  gain,
  period,
  className = '',
}) {
  const isControlled = maskedProp !== undefined
  const [inner, setInner] = useState(defaultMasked)
  const masked = isControlled ? maskedProp : inner

  const [whole, cents] = fmt(value ?? 0).split('.')

  function toggle() {
    if (!isControlled) setInner((v) => !v)
    onToggleMask?.(!masked)
  }

  return (
    <div className={['Balance', `Balance--${align}`, className].filter(Boolean).join(' ')}>
      <div className="Balance__head">
        <Text variant="label" tone="dim">{label}</Text>
        <IconButton
          variant="ghost"
          size={32}
          icon={masked ? 'eye-off' : 'eye'}
          onClick={toggle}
          aria-label={masked ? 'Show balance' : 'Hide balance'}
        />
      </div>

      {loading ? (
        <Skeleton shape="rect" w={220} h={40} />
      ) : (
        <Text variant="display" numeric>
          {masked ? `${currency}••,•••` : `${currency}${whole}`}
          <span className="Balance__cents">{masked ? '.••' : `.${cents}`}</span>
        </Text>
      )}

      {!loading && delta !== undefined && (
        <div className="Balance__delta">
          <Amount value={delta} currency="" suffix="%" sign={delta >= 0 ? 'plus' : 'minus'} showArrow size="sm" masked={masked} />
          {(gain !== undefined || period) && (
            <Text variant="bodySm" tone="dim" numeric>
              {[gain !== undefined && !masked && `${gain >= 0 ? '+' : '−'}${currency}${fmt(Math.abs(gain))}`, period].filter(Boolean).join(' · ')}
            </Text>
          )}
        </div>
      )}
    </div>
  )
}
