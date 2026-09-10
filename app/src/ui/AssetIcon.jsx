import { Icon } from '../icons/Icon.jsx'
import './AssetIcon.css'

/**
 * L3 · AssetIcon
 *
 * Sizing contract (Figma): W=fixed(size) H=fixed(size) · radius full
 *
 * Component Properties: symbol — Variant (btc eth usdt sol bnb …)
 *                        size   — Variant: 24 32 40
 *                        chain-badge (bool)
 *
 * Filled coin icons live in the assets icon pack — this component
 * wraps them in a circle of the right size and falls back to a
 * monogram for symbols without an icon (any other token).
 */

const KNOWN_SYMBOLS = ['btc', 'eth', 'usdt', 'sol', 'bnb']

const SYMBOL_TONE = {
  btc: '--c-btc', eth: '--c-eth', usdt: '--c-usdt', sol: '--c-sol', bnb: '--c-bnb',
}

export function AssetIcon({ symbol, size = 32, chainBadge = false, chainIcon, className = '', ...rest }) {
  const known = KNOWN_SYMBOLS.includes(symbol)
  const tone = SYMBOL_TONE[symbol]

  const cls = ['AssetIcon', `AssetIcon--${size}`, tone && 'AssetIcon--tinted', className].filter(Boolean).join(' ')
  const iconSize = size <= 24 ? 14 : size <= 32 ? 18 : 22

  return (
    <span className={cls} style={tone ? { '--asset-tone': `var(${tone})` } : undefined} {...rest}>
      {known
        ? <Icon name={symbol} size={iconSize} tone="inherit" />
        : <span className="AssetIcon__mono">{symbol?.slice(0, 3)}</span>}

      {chainBadge && (
        <span className="AssetIcon__chain" aria-hidden="true">
          <Icon name={chainIcon || 'eth'} size={10} tone="inherit" />
        </span>
      )}
    </span>
  )
}
