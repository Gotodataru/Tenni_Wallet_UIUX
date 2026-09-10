import { Icon } from '../icons/Icon.jsx'
import './Avatar.css'

/**
 * L3 · Avatar
 *
 * Sizing contract (Figma): W=fixed(size) H=fixed(size) · radius full
 * Component Properties: size — Variant: 28 36 40 48 56
 *                        type — Variant: image initials icon asset
 *                        ring (bool) · badge (bool — status dot, is-abs)
 */
export function Avatar({
  size = 40,
  type = 'initials',
  src,
  initials,
  icon,
  ring = false,
  badge = false,
  className = '',
  ...rest
}) {
  const cls = [
    'Avatar',
    `Avatar--${size}`,
    ring && 'Avatar--ring',
    className,
  ].filter(Boolean).join(' ')

  const iconSize = size <= 32 ? 16 : size <= 44 ? 20 : 24

  return (
    <span className={cls} {...rest}>
      {type === 'image' && src && <img className="Avatar__image" src={src} alt="" />}
      {type === 'initials' && <span className="Avatar__initials">{initials}</span>}
      {type === 'icon' && <Icon name={icon} size={iconSize} tone="inherit" />}
      {type === 'asset' && <Icon name={icon || 'stake'} size={iconSize} tone="inherit" />}
      {badge && <span className="Avatar__badge" aria-hidden="true" />}
    </span>
  )
}
