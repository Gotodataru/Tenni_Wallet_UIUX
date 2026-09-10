import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { Button } from './Button.jsx'
import './EmptyState.css'

/**
 * L4 · EmptyState
 *
 * Sizing contract (Figma): column · W=fill H=hug · pad 32/24 · gap 16 · align center
 * props: illustration (slot — ReactNode), icon (fallback), title, body,
 *        action (bool), actionLabel, onAction
 *
 * `illustration` is a slot (like leading in ListRow), not an enum,
 * so adding the illustration set didn't change the API. Without it
 * the component draws a neutral placeholder: an icon in a circle.
 * Also used for result screens (processing / paid / declined / sent).
 */
export function EmptyState({
  illustration,
  icon = 'search',
  title,
  body,
  action = false,
  actionLabel = 'Refresh',
  onAction,
  className = '',
  ...rest
}) {
  const cls = ['EmptyState', className].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      <div className="EmptyState__illustration">
        {illustration || (
          <span className="EmptyState__placeholder" aria-hidden="true">
            <Icon name={icon} size={32} tone="inherit" />
          </span>
        )}
      </div>

      <div className="EmptyState__text">
        {title && <Text variant="h3" align="center">{title}</Text>}
        {body && <Text variant="bodySm" tone="dim" align="center">{body}</Text>}
      </div>

      {action && <Button variant="secondary" size="md" onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
