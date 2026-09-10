import { useId, useState, useCallback } from 'react'
import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { formatByType, detectCardBrand } from './inputMasks.js'
import './Input.css'

/**
 * L2 · Input
 *
 * Sizing contract (Figma):
 *   column · W=fill H=hug · gap 6
 *   ├ label      Text/label
 *   ├ field      row · W=fill H=fixed(48) · pad 0/14 · gap 10
 *   │  ├ icon?   fixed(20)
 *   │  ├ input   fill · min-width 0
 *   │  └ action? fixed(20)
 *   └ hint/error Text/bodySm (not caption: a sentence, not a tag)
 *
 * Figma Component Properties:
 *   type    — Variant: text amount card cvc expiry address search pin
 *   state   — Variant: default focus filled error success disabled readonly
 *   iconLeading / iconTrailing — Boolean
 *   action  — slot (Instance swap): a trailing control inside the field,
 *             e.g. a "Paste" or "Scan" button. Unlike iconTrailing it is
 *             interactive, so it lives in its own hug container.
 *
 * Masks (card / expiry / cvc / amount) live in inputMasks.js — pure
 * functions, independent of React. type="address" is the same text
 * field in monospace (addresses are checked character by character).
 */

const ICON_SIZE = 20

const CARD_BRAND_ICON = { visa: 'card', mastercard: 'card' }   // a neutral icon — no brand logos, see FIGMA_RULES

export function Input({
  type = 'text',
  label,
  placeholder,
  value,
  defaultValue = '',
  onChange,
  state,
  iconLeading,
  iconTrailing,
  action,
  hint,
  error,
  disabled = false,
  readOnly = false,
  className = '',
  id,
  ...rest
}) {
  const autoId = useId()
  const inputId = id || autoId
  const [focused, setFocused] = useState(false)

  const isControlled = value !== undefined
  const [inner, setInner] = useState(defaultValue)
  const raw = isControlled ? value : inner

  const handleChange = useCallback((e) => {
    const formatted = formatByType(type, e.target.value)
    if (!isControlled) setInner(formatted)
    onChange?.(formatted)
  }, [type, isControlled, onChange])

  // `state` forces the look (the catalog shows every state at once).
  // Without it the state comes from real interaction, as in a browser.
  const isDisabled = disabled || state === 'disabled'
  const isReadOnly = readOnly || state === 'readonly'
  const hasError = Boolean(error) || state === 'error'

  const computedState = isDisabled
    ? 'disabled'
    : isReadOnly
    ? 'readonly'
    : hasError
    ? 'error'
    : state === 'success'
    ? 'success'
    : state === 'filled'
    ? 'filled'
    : focused
    ? 'focus'
    : raw
    ? 'filled'
    : 'default'

  const cls = ['Input', `is-${computedState}`, `Input--${type}`, className].filter(Boolean).join(' ')

  const nativeType = type === 'cvc' || type === 'pin' ? 'password' : type === 'search' ? 'search' : 'text'
  const inputMode = { amount: 'decimal', card: 'numeric', cvc: 'numeric', expiry: 'numeric', pin: 'numeric' }[type] || 'text'

  const brand = type === 'card' ? detectCardBrand(raw) : null
  const resolvedLeading = iconLeading || (brand && CARD_BRAND_ICON[brand])

  return (
    <div className={cls}>
      {label && (
        <label htmlFor={inputId} className="Input__label">
          <Text variant="label" tone={computedState === 'error' ? 'danger' : 'dim'}>{label}</Text>
        </label>
      )}

      <div className="Input__field">
        {resolvedLeading && (
          <Icon name={resolvedLeading} size={ICON_SIZE} tone={computedState === 'error' ? 'danger' : 'dim'} className="Input__icon" />
        )}

        <input
          id={inputId}
          className="Input__control"
          type={nativeType}
          inputMode={inputMode}
          value={raw}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          autoComplete={type === 'cvc' ? 'off' : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={handleChange}
          {...rest}
        />

        {iconTrailing && (
          <Icon name={iconTrailing} size={ICON_SIZE} tone="dim" className="Input__icon" />
        )}
        {!iconTrailing && computedState === 'error' && (
          <Icon name="alert-circle" size={ICON_SIZE} tone="danger" className="Input__icon" />
        )}
        {!iconTrailing && computedState === 'success' && (
          <Icon name="check-circle" size={ICON_SIZE} tone="success" className="Input__icon" />
        )}
        {action && <span className="Input__action">{action}</span>}
      </div>

      {/* bodySm, not caption: a hint is a sentence, and caption is set in
          caps (short tags like "RECIPIENT"); a two-line warning in caps
          reads as shouting. And dim, not faint: the system marks faint
          as decoration only (below 4.5:1). */}
      {(hint || error) && (
        <Text variant="bodySm" tone={error ? 'danger' : 'dim'} className="Input__hint">
          {error || hint}
        </Text>
      )}
    </div>
  )
}
