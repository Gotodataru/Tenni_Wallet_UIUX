import { Icon } from '../icons/Icon.jsx'
import './Amount.css'

/**
 * L3 · Amount
 *
 * Sizing contract (Figma): row · W=hug H=hug · gap 4 · align baseline
 *
 * A separate component so the rule "up and down are never color
 * alone" lives in one place instead of on every screen: showArrow
 * draws ▲/▼ next to the color for color-blind users.
 *
 * props: value (number), currency (string, prefix — "$"),
 *        suffix (string — "%" for deltas, " BTC" for crypto),
 *        precision (decimals, default 2 — two decimals would round
 *        0.005 BTC to 0.01, so crypto amounts pass a higher value),
 *        size (sm|md|lg|xl), sign (none|plus|minus),
 *        tone (auto|up|down|neutral), showArrow (bool), masked (bool)
 */
export function Amount({
  value,
  currency = '$',
  suffix = '',
  precision = 2,
  size = 'md',
  sign = 'none',
  tone = 'auto',
  showArrow = false,
  masked = false,
  className = '',
  ...rest
}) {
  const resolvedTone = tone === 'auto'
    ? (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral')
    : tone

  const cls = ['Amount', `Amount--${size}`, `Amount--${resolvedTone}`, className].filter(Boolean).join(' ')
  const arrowIcon = resolvedTone === 'up' ? 'arrow-up' : resolvedTone === 'down' ? 'arrow-down' : null
  const arrowSize = { sm: 12, md: 14, lg: 16, xl: 20 }[size]

  const prefix = sign === 'plus' ? '+' : sign === 'minus' ? '−' : ''
  const formatted = masked
    ? '••••'
    : Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })

  return (
    <span className={cls} {...rest}>
      {showArrow && arrowIcon && <Icon name={arrowIcon} size={arrowSize} tone="inherit" className="Amount__arrow" />}
      <span className="Amount__value">{prefix}{currency}{formatted}{suffix}</span>
    </span>
  )
}
