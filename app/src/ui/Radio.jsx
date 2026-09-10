import { useState } from 'react'
import './Radio.css'

/**
 * L2 · Radio
 *
 * Sizing contract (Figma): W=fixed(22) H=fixed(22)
 * Component Properties: state — Variant: unchecked checked disabled error
 *
 * The control only — grouping and labels are composed by the consumer.
 */
export function Radio({
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

  const isDisabled = disabled || state === 'disabled'
  const hasError = state === 'error'

  function handleClick() {
    if (isDisabled) return
    if (!isControlled) setInner(true)
    onChange?.(true)
  }

  const cls = [
    'Radio',
    on && 'is-checked',
    isDisabled && 'is-disabled',
    hasError && 'is-error',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={isDisabled}
      className={cls}
      onClick={handleClick}
      {...rest}
    >
      <span className="Radio__dot" />
    </button>
  )
}
