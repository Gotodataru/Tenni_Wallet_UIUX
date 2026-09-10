import './Segmented.css'

/**
 * L2 · Segmented
 *
 * Sizing contract (Figma): row · W=fill H=fixed(40) · pad 4 · gap 2
 *
 * props: items — string[] (2-4), active — index, onChange(index)
 */
export function Segmented({ items, active = 0, onChange, disabled = false, className = '' }) {
  return (
    <div className={['Segmented', disabled && 'is-disabled', className].filter(Boolean).join(' ')} role="tablist">
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={i === active}
          disabled={disabled}
          className={`Segmented__item${i === active ? ' is-active' : ''}`}
          onClick={() => onChange?.(i)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
