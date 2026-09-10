import { Icon } from '../icons/Icon.jsx'
import './Chip.css'

/**
 * L2 · Chip
 *
 * Sizing contract (Figma): row · W=hug H=fixed(32|24) · pad 0/12 · gap 6
 *
 * Component Properties:
 *   variant — Variant: neutral accent success danger warning outline
 *   size    — Variant: sm(24) md(32)
 *   icon (bool) · selected (bool) · removable (bool)
 */
export function Chip({
  variant = 'neutral',
  size = 'md',
  icon,
  selected = false,
  removable = false,
  onRemove,
  onClick,
  children,
  className = '',
  ...rest
}) {
  const interactive = Boolean(onClick)
  const Tag = interactive ? 'button' : 'span'
  const iconSize = size === 'sm' ? 14 : 16

  const cls = [
    'Chip',
    `Chip--${variant}`,
    `Chip--${size}`,
    selected && 'is-selected',
    interactive && 'is-interactive',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      className={cls}
      onClick={onClick}
      aria-pressed={interactive ? selected : undefined}
      {...rest}
    >
      {icon && <Icon name={icon} size={iconSize} tone="inherit" />}
      <span className="Chip__label">{children}</span>
      {removable && (
        <button
          type="button"
          className="Chip__remove"
          aria-label="Remove"
          onClick={(e) => { e.stopPropagation(); onRemove?.() }}
        >
          <Icon name="close" size={iconSize} tone="inherit" />
        </button>
      )}
    </Tag>
  )
}
