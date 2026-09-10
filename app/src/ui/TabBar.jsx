import { NavItem } from './NavItem.jsx'
import './TabBar.css'

/**
 * L5 · TabBar
 *
 * Sizing contract (Figma): row · W=fill H=fixed(64) · pad 0/8 · gap 0
 * └ NavItem ×5 · fill
 *
 * props: items — [{ id, icon, label, badge }] (4–5 tabs),
 *        active (id), onChange(id), theme (solid|glass), labels (bool)
 */
export function TabBar({ items, active, onChange, theme = 'solid', labels = true, className = '', ...rest }) {
  const cls = ['TabBar', `TabBar--${theme}`, className].filter(Boolean).join(' ')

  return (
    <nav className={cls} aria-label="Main navigation" {...rest}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          showLabels={labels}
          state={item.id === active ? 'active' : 'default'}
          onClick={() => onChange?.(item.id)}
        />
      ))}
    </nav>
  )
}
