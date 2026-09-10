import { Text } from './Text.jsx'
import { IconButton } from './IconButton.jsx'
import './BottomSheet.css'

/**
 * L4 · BottomSheet
 *
 * Sizing contract (Figma):
 *   column · W=fill H=hug · pad 8/20/24 (top/side/bottom) · gap 16 · radius top xl
 *   ├ grabber  fixed(36×4)
 *   ├ header   row: title + IconButton(close)
 *   ├ content  fill
 *   └ actions  row · gap 12
 *
 * props: size (auto|half|full), grabber (bool), header (bool),
 *        title, onClose, actions (ReactNode)
 *
 * Like Modal, the component is the panel only. The slide-up animation
 * and the scrim belong to the screen; size only caps the content
 * height for half/full.
 */
export function BottomSheet({
  size = 'auto',
  grabber = true,
  header = true,
  title,
  onClose,
  actions,
  children,
  className = '',
  ...rest
}) {
  const cls = ['BottomSheet', `BottomSheet--${size}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      {grabber && <span className="BottomSheet__grabber" aria-hidden="true" />}

      {header && (
        <div className="BottomSheet__header">
          <Text variant="title" fill truncate>{title}</Text>
          <IconButton variant="ghost" size={32} icon="close" onClick={onClose} aria-label="Close" />
        </div>
      )}

      <div className="BottomSheet__content">{children}</div>

      {actions && <div className="BottomSheet__actions">{actions}</div>}
    </div>
  )
}
