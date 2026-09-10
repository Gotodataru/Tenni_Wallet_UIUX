import { useState } from 'react'
import { Text } from './Text.jsx'
import './Slider.css'

/**
 * L2 · Slider
 *
 * Sizing contract (Figma): column · W=fill H=hug · gap 8
 * Component Properties: state — Variant: default active disabled
 *                        showTicks (bool) · showValue (bool)
 *
 * Used for slippage on Swap and fee speed on Send.
 *
 * The track fill and thumb position depend on the numeric VALUE, not
 * on layout — not a layout percentage (banned by FIGMA_RULES §2) but a
 * value visualization: in Figma the same result is a width bound to a
 * Number variable. See the value-fill note in Slider.css and
 * docs/FIGMA_RULES.md §2.
 */
export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  onChange,
  state,
  showTicks = false,
  showValue = false,
  formatValue = (v) => String(v),
  label,
  className = '',
  ...rest
}) {
  const isControlled = value !== undefined
  const [inner, setInner] = useState(defaultValue)
  const raw = isControlled ? value : inner
  const disabled = state === 'disabled'

  const pct = ((raw - min) / (max - min)) * 100
  const tickCount = showTicks ? Math.floor((max - min) / step) + 1 : 0

  function handleChange(e) {
    const next = Number(e.target.value)
    if (!isControlled) setInner(next)
    onChange?.(next)
  }

  const cls = ['Slider', state === 'active' && 'is-active', disabled && 'is-disabled', className].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {(label || showValue) && (
        <div className="Slider__head">
          {label && <Text variant="label" tone="dim">{label}</Text>}
          {showValue && <Text variant="label" tone="accent" numeric>{formatValue(raw)}</Text>}
        </div>
      )}

      <div className="Slider__track" style={{ '--pct': pct }}>
        <div className="Slider__fill" />

        {showTicks && (
          <div className="Slider__ticks">
            {Array.from({ length: tickCount }, (_, i) => <span key={i} className="Slider__tick" />)}
          </div>
        )}

        <div className="Slider__thumb" aria-hidden="true" />

        <input
          type="range"
          className="Slider__input"
          min={min}
          max={max}
          step={step}
          value={raw}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
      </div>
    </div>
  )
}
