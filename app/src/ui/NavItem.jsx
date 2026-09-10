import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import './NavItem.css'

/**
 * L5 · NavItem
 *
 * Sizing contract (Figma): column · W=fill H=fill · gap 4 · center
 * props: state (default|active|disabled), icon, label, badge (bool),
 *        showLabels (bool — hide labels, keep icons only)
 */
export function NavItem({ icon, label, state = 'default', badge = false, showLabels = true, onClick, className = '', ...rest }) {
  const isDisabled = state === 'disabled'
  const isActive = state === 'active'

  const cls = ['NavItem', isActive && 'is-active', isDisabled && 'is-disabled', className].filter(Boolean).join(' ')

  return (
    <button type="button" className={cls} onClick={isDisabled ? undefined : onClick} disabled={isDisabled} aria-current={isActive ? 'page' : undefined} {...rest}>
      <span className="NavItem__iconWrap">
        <Icon name={icon} size={22} tone="inherit" />
        {badge && <span className="NavItem__badge" aria-hidden="true" />}
      </span>
      {showLabels && <Text variant="caption" className="NavItem__label">{label}</Text>}
    </button>
  )
}
