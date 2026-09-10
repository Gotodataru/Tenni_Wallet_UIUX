import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { Button } from './Button.jsx'
import './LockOverlay.css'

const METHOD_ICON = { faceid: 'face-id', touchid: 'touch-id', pin: 'pin' }

const STATE_LABEL = {
  faceid: {
    idle: 'Look at the camera',
    scanning: 'Scanning…',
    success: 'Done',
    failed: 'Not recognized',
  },
  touchid: {
    idle: 'Touch the sensor',
    scanning: 'Scanning…',
    success: 'Done',
    failed: 'Not recognized',
  },
  pin: {
    idle: 'Enter your PIN',
    scanning: 'Checking…',
    success: 'Done',
    failed: 'Wrong PIN',
  },
}

/**
 * L4 · LockOverlay — a biometric lock over the app
 *
 * Sizing contract (Figma): column · W=fill H=fill · center · gap 24
 * props: method (faceid|touchid|pin), state (idle|scanning|success|failed),
 *        onRetry, onUseFallback, fallbackLabel
 *
 * A full-screen layer that doesn't position itself over the app (no
 * position: fixed) — the screen decides that. LockOverlay only fills
 * the container it's given (W=fill H=fill), as the contract says.
 */
export function LockOverlay({
  method = 'faceid',
  state = 'idle',
  onRetry,
  onUseFallback,
  fallbackLabel,
  className = '',
  ...rest
}) {
  const cls = ['LockOverlay', `is-${state}`, className].filter(Boolean).join(' ')
  const label = STATE_LABEL[method][state]

  return (
    <div className={cls} {...rest}>
      <div className="LockOverlay__ring">
        <span className="LockOverlay__pulse" aria-hidden="true" />
        <Icon
          name={state === 'success' ? 'check-circle' : state === 'failed' ? 'x-circle' : METHOD_ICON[method]}
          size={40}
          tone="inherit"
        />
      </div>

      <div className="LockOverlay__text">
        <Text variant="title" align="center">{label}</Text>
        {state === 'failed' && (
          <Text variant="bodySm" tone="dim" align="center">Try again</Text>
        )}
      </div>

      {state === 'failed' && (
        <div className="LockOverlay__actions">
          <Button variant="primary" size="lg" onClick={onRetry}>Retry</Button>
          {method !== 'pin' && onUseFallback && (
            <Button variant="link" size="md" onClick={onUseFallback}>{fallbackLabel || 'Use PIN'}</Button>
          )}
        </div>
      )}
    </div>
  )
}
