import { Icon } from '../icons/Icon.jsx'
import './IconButton.css'

/**
 * L2 · IconButton
 *
 * Sizing contract (Figma):
 *   row · W=fixed(size) H=fixed(size) · pad 0 · center
 *
 * Figma Component Properties:
 *   variant — Variant: ghost solid outline
 *   size    — Variant: 32 40 48
 *   state   — Variant: default hover pressed focus disabled loading
 *   icon    — Instance swap
 *   badge   — Boolean (the one legal is-abs — a dot over the icon)
 *
 * state works two ways (:hover OR an is-* class), same as Button.jsx —
 * see the comment there.
 */

const ICON_SIZE = { 32: 16, 40: 20, 48: 24 }

export function IconButton({
  variant = 'ghost',
  size = 40,
  state,
  icon,
  badge = false,
  shape = 'circle',
  className = '',
  'aria-label': ariaLabel,
  ...rest
}) {
  const isDisabled = state === 'disabled'
  const isLoading = state === 'loading'

  const cls = [
    'IconButton',
    `IconButton--${variant}`,
    `IconButton--${size}`,
    shape === 'rounded' && 'IconButton--rounded',
    state && `is-${state}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cls}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      {...rest}
    >
      {isLoading
        ? <Icon name="spinner" size={ICON_SIZE[size]} className="Icon--spin" />
        : <Icon name={icon} size={ICON_SIZE[size]} />}
      {badge && <span className="IconButton__badge" aria-hidden="true" />}
    </button>
  )
}
