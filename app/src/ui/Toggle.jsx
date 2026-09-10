import { useState } from 'react'
import './Toggle.css'

/**
 * L2 · Toggle / Switch
 *
 * Sizing contract (Figma):
 *   row · W=fixed(52) H=fixed(32) · pad 3 · thumb fixed(26)
 *
 * Figma Component Properties:
 *   state — Variant: off on disabled-off disabled-on focus
 *
 * Controlled (checked + onChange) and uncontrolled (defaultChecked)
 * modes — like a native <input type="checkbox">.
 */
export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  state,
  className = '',
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = checked !== undefined
  const [inner, setInner] = useState(defaultChecked)
  const on = isControlled ? checked : inner

  const isDisabled = disabled || state === 'disabled-off' || state === 'disabled-on'

  function handleClick() {
    if (isDisabled) return
    const next = !on
    if (!isControlled) setInner(next)
    onChange?.(next)
  }

  const cls = [
    'Toggle',
    on && 'is-on',
    isDisabled && 'is-disabled',
    state === 'focus' && 'is-focus',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={isDisabled}
      className={cls}
      onClick={handleClick}
      {...rest}
    >
      <span className="Toggle__thumb" />
    </button>
  )
}
