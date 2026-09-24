import { Icon } from '../icons/Icon.jsx'
import { ICONS } from '../icons/paths.js'
import { Text } from './Text.jsx'
import './NavItem.css'

/**
 * L5 · NavItem
 *
 * Sizing contract (Figma): column · W=fill H=fill · gap 4 · center
 * props: state (default|active|disabled), icon, label, badge (bool),
 *        showLabels (bool — hide labels, keep icons only)
 *
 * Active → the icon's filled twin (<icon>-fill) when the set has one.
 * The label is always the button's accessible name, shown or not.
 */
export function NavItem({ icon, label, state = 'default', badge = false, showLabels = true, onClick, className = '', ...rest }) {
  const isDisabled = state === 'disabled'
  const isActive = state === 'active'

  const cls = ['NavItem', isActive && 'is-active', isDisabled && 'is-disabled', className].filter(Boolean).join(' ')

  return (
    <button type="button" className={cls} onClick={isDisabled ? undefined : onClick} disabled={isDisabled} aria-current={isActive ? 'page' : undefined} aria-label={label} {...rest}>
      <span className="NavItem__iconWrap">
        <Icon name={isActive && ICONS[`${icon}-fill`] ? `${icon}-fill` : icon} size={22} tone="inherit" />
        {badge && <span className="NavItem__badge" aria-hidden="true" />}
      </span>
      {showLabels && <Text variant="caption" className="NavItem__label">{label}</Text>}
    </button>
  )
}
