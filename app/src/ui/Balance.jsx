import { useState } from 'react'
import { Text } from './Text.jsx'
import { IconButton } from './IconButton.jsx'
import { Amount } from './Amount.jsx'
import { Chip } from './Chip.jsx'
import { Skeleton } from './Skeleton.jsx'
import './Balance.css'

/**
 * L3 · Balance
 *
 * Sizing contract (Figma):
 *   column · W=hug H=hug · gap 6 · align center
 *   ├ row: label + IconButton(eye)
 *   ├ Text/display — amount
 *   └ row: Amount(delta) + Chip(period)
 *
 * props: value, currency, masked (bool, controlled or uncontrolled —
 *        like Toggle), loading (bool), delta (percent, number|undefined),
 *        period (string), align (center|start)
 *
 * align="start" — the balance as the screen header, left, with the
 * avatar on the right (Home). center — a standalone centered block.
 */
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
  period,
  className = '',
}) {
  const isControlled = maskedProp !== undefined
  const [inner, setInner] = useState(defaultMasked)
  const masked = isControlled ? maskedProp : inner

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
          {masked ? `${currency}••,•••.••` : `${currency}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </Text>
      )}

      {!loading && delta !== undefined && (
        <div className="Balance__delta">
          <Amount value={delta} currency="" suffix="%" sign={delta >= 0 ? 'plus' : 'minus'} showArrow size="sm" masked={masked} />
          {period && <Chip variant="neutral" size="sm">{period}</Chip>}
        </div>
      )}
    </div>
  )
}
