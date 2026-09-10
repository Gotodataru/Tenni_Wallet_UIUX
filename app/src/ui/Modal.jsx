import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { Button } from './Button.jsx'
import './Modal.css'

/**
 * L4 · Modal
 *
 * Sizing contract (Figma): column · W=fixed(320) H=hug · pad 24 · gap 16 · radius xl
 * props: icon (bool), title, body, actions (1|2 — [{label, variant, onClick}]),
 *        tone (neutral|danger)
 *
 * The component is the PANEL only, as the contract says (W=fixed(320)).
 * The dimmed background is a separate layer of the scene (in Figma a
 * Scrim frame under the panel). The catalog builds the scrim on the
 * page, not inside the component, so a fixed-width panel isn't mixed
 * up with a full-screen layer.
 */
export function Modal({ icon, title, body, actions = [], tone = 'neutral', className = '', ...rest }) {
  const cls = ['Modal', `Modal--${tone}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} role="alertdialog" aria-modal="true" {...rest}>
      {icon && (
        <span className="Modal__icon">
          <Icon name={tone === 'danger' ? 'alert-triangle' : icon} size={24} tone="inherit" />
        </span>
      )}

      <div className="Modal__text">
        {title && <Text variant="h3" align="center">{title}</Text>}
        {body && <Text variant="bodySm" tone="dim" align="center">{body}</Text>}
      </div>

      {actions.length > 0 && (
        <div className={`Modal__actions${actions.length > 1 ? ' Modal__actions--row' : ''}`}>
          {actions.map((a, i) => (
            <Button key={i} variant={a.variant || (i === 0 ? (tone === 'danger' ? 'danger' : 'primary') : 'secondary')} size="lg" fullWidth onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
