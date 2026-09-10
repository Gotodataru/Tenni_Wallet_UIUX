import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { Button } from './Button.jsx'
import './Banner.css'

const TONE_ICON = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'alert-circle' }

/**
 * L4 · Banner — an inline notice, part of the page flow
 *
 * Sizing contract (Figma): row · W=fill H=hug · pad 12/16 · gap 8 · radius md
 * (the first spec said pad 12/14 · gap 10 — neither is on the 4-pt
 * scale, so they are 16 and 8)
 *
 * props: tone (info|success|warning|danger), title (bold line above
 *        the body), body, action (bool), actionLabel, onAction
 *
 * Use: "No connection", "Not enough funds", "The rate changed" —
 * part of the screen flow, unlike Toast (floating) and Modal (on top).
 */
export function Banner({
  tone = 'info',
  title,
  body,
  action = false,
  actionLabel = 'Retry',
  onAction,
  className = '',
  ...rest
}) {
  const cls = ['Banner', `Banner--${tone}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} role={tone === 'danger' ? 'alert' : 'status'} {...rest}>
      <Icon name={TONE_ICON[tone]} size={20} tone="inherit" className="Banner__icon" />
      <div className="Banner__body">
        {title && <Text variant="label">{title}</Text>}
        {body && <Text variant="bodySm" tone="dim">{body}</Text>}
      </div>
      {action && <Button variant="link" size="sm" onClick={onAction}>{actionLabel}</Button>}
    </div>
  )
}
