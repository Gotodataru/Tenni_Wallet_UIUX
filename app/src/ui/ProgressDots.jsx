import './ProgressDots.css'

/**
 * L3 · ProgressDots
 *
 * Sizing contract (Figma): row · W=hug H=fixed(8) · gap 6
 * props: total (number), active (index, 0-based)
 */
export function ProgressDots({ total, active = 0, className = '' }) {
  return (
    <div className={['ProgressDots', className].filter(Boolean).join(' ')} role="progressbar" aria-valuenow={active + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`ProgressDots__dot${i === active ? ' is-active' : ''}`} />
      ))}
    </div>
  )
}
