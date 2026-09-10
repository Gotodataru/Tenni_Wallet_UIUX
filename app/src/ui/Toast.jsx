import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { IconButton } from './IconButton.jsx'
import { Button } from './Button.jsx'
import './Toast.css'

const TONE_ICON = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'alert-circle' }

/**
 * L4 · Toast
 *
 * Sizing contract (Figma): row · W=fill H=hug · pad 12/16 · gap 12 · radius lg
 * (the first spec said pad 14/16 — 14 is off the 4-pt scale, so 12)
 *
 * props: tone (info|success|warning|danger), icon (bool), action (bool),
 *        dismissible (bool), actionLabel, onAction, onDismiss
 *
 * The component is the card only. Positioning (floating over the
 * screen, stacking several toasts, auto-dismiss on a timer) belongs to
 * the screen, not the design system.
 */
export function Toast({
  tone = 'info',
  icon = true,
  message,
  action = false,
  actionLabel = 'Retry',
  onAction,
  dismissible = false,
  onDismiss,
  className = '',
  ...rest
}) {
  const cls = ['Toast', `Toast--${tone}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} role="status" {...rest}>
      {icon && <Icon name={TONE_ICON[tone]} size={20} tone="inherit" className="Toast__icon" />}
      <Text variant="bodySm" className="Toast__message" fill>{message}</Text>
      {action && <Button variant="link" size="sm" onClick={onAction}>{actionLabel}</Button>}
      {dismissible && <IconButton variant="ghost" size={32} icon="close" onClick={onDismiss} aria-label="Dismiss" />}
    </div>
  )
}
