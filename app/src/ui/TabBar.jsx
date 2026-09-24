import { NavItem } from './NavItem.jsx'
import './TabBar.css'

/**
 * L5 · TabBar
 *
 * Sizing contract (Figma): row · W=fill H=fixed(64) · pad 0/8 · gap 0
 * └ NavItem ×5 · fill
 *
 * props: items — [{ id, icon, label, badge }] (4–5 tabs),
 *        active (id), onChange(id), theme (floating|solid|glass), labels (bool)
 *
 * floating (default) — a capsule that floats above the bottom edge; the
 * active tab becomes a ball-colored pill with its label, the others are
 * icons only (their label stays as the accessible name). One strong
 * "you are here" instead of four equal labels.
 * Figma: row · pad 0/24/8 · the capsule is a rectangle set to Absolute
 * position behind the tabs; the active NavItem is a hug row.
 */
export function TabBar({ items, active, onChange, theme = 'floating', labels = true, className = '', ...rest }) {
  const cls = ['TabBar', `TabBar--${theme}`, className].filter(Boolean).join(' ')

  return (
    <nav className={cls} aria-label="Main navigation" {...rest}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          showLabels={theme === 'floating' ? item.id === active : labels}
          state={item.id === active ? 'active' : 'default'}
          onClick={() => onChange?.(item.id)}
        />
      ))}
    </nav>
  )
}
