import { useState } from 'react'
import { Icon } from '../icons/Icon.jsx'
import './Checkbox.css'

/**
 * L2 · Checkbox
 *
 * Sizing contract (Figma): W=fixed(22) H=fixed(22)
 * Component Properties: state — Variant: unchecked checked indeterminate disabled error
 *
 * The control only — the label next to it is composed with Stack
 * (see the catalog), same as Toggle.
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
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

  const isDisabled = disabled || state === 'disabled'
  const isIndeterminate = indeterminate || state === 'indeterminate'
  const hasError = state === 'error'

  function handleClick() {
    if (isDisabled) return
    const next = !on
    if (!isControlled) setInner(next)
    onChange?.(next)
  }

  const cls = [
    'Checkbox',
    on && 'is-checked',
    isIndeterminate && 'is-indeterminate',
    isDisabled && 'is-disabled',
    hasError && 'is-error',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate ? 'mixed' : on}
      aria-label={ariaLabel}
      disabled={isDisabled}
      className={cls}
      onClick={handleClick}
      {...rest}
    >
      {isIndeterminate
        ? <Icon name="minus" size={16} tone="inherit" className="Checkbox__mark" />
        : on && <Icon name="check" size={16} tone="inherit" className="Checkbox__mark" />}
    </button>
  )
}
