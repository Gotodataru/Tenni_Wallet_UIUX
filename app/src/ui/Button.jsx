import { Icon } from '../icons/Icon.jsx'
import './Button.css'

/**
 * L2 · Button — the key component of the system
 *
 * Sizing contract (Figma):
 *   row · W=hug (fullWidth → fill) · H=fixed(by size)
 *   pad: sm 0/12 · md 0/16 · lg 0/20 · xl 0/24
 *   gap 8 · align center/center
 *
 * Figma Component Properties (not 1008 separate variants):
 *   variant  — Variant: primary secondary ghost outline danger success link
 *   size     — Variant: sm md lg xl
 *   state    — Variant: default hover pressed focus disabled loading
 *   label    — Text property
 *   iconLeading / iconTrailing — Boolean + Instance swap
 *   fullWidth — Boolean (hug → fill)
 *
 * `state` works two ways at once — as real :hover/:active in the
 * browser and as a forced class in the catalog, so every state can
 * be shown side by side and captured into Figma.
 */

const ICON_SIZE = { sm: 16, md: 20, lg: 20, xl: 24 }

export function Button({
  variant = 'primary',
  size = 'md',
  state,
  iconLeading,
  iconTrailing,
  iconOnly = false,
  fullWidth = false,
  className = '',
  children,
  ...rest
}) {
  const isDisabled = state === 'disabled'
  const isLoading = state === 'loading'
  const iconSize = ICON_SIZE[size]

  const cls = [
    'Button',
    `Button--${variant}`,
    `Button--${size}`,
    state && `is-${state}`,
    fullWidth && 'Button--fullWidth',
    iconOnly && 'Button--iconOnly',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cls}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <Icon name="spinner" size={iconSize} className="Icon--spin Button__spinner" />}
      {iconLeading && !isLoading && <Icon name={iconLeading} size={iconSize} />}
      {children && <span className="Button__label">{children}</span>}
      {iconTrailing && <Icon name={iconTrailing} size={iconSize} />}
    </button>
  )
}
