import { Skeleton } from './Skeleton.jsx'
import { Text } from './Text.jsx'
import './Sparkline.css'

/**
 * L3 · Sparkline
 *
 * Sizing contract (Figma): W=fill H=fixed(64)
 * props: data (number[]), tone (up|down|neutral),
 *        showFill (bool), showDots (bool), state (default|loading|empty)
 *
 * Guards against `range === 0`: dividing by max − min without a check
 * breaks into NaN on a flat series (all values equal — typical for a
 * new wallet with no history). With range === 0 it draws a centered
 * line.
 */
const W = 280
const H = 64
const PAD = 6   // top/bottom inset so the dots aren't clipped at the edges

export function Sparkline({ data, tone = 'neutral', showFill = false, showDots = false, state = 'default', className = '' }) {
  const cls = ['Sparkline', className].filter(Boolean).join(' ')

  if (state === 'loading') {
    return (
      <div className={cls}>
        <Skeleton shape="rect" h={H} radius="var(--r-md)" />
      </div>
    )
  }

  if (state === 'empty' || !data || data.length === 0) {
    return (
      <div className={cls}>
        <div className="Sparkline__empty">
          <Text variant="caption" tone="faint">No data for this period</Text>
        </div>
      </div>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  const points = data.map((v, i) => {
    const x = data.length === 1 ? W / 2 : (i / (data.length - 1)) * W
    // range === 0 → all values equal → a centered line, not NaN
    const y = range === 0 ? H / 2 : PAD + (1 - (v - min) / range) * (H - PAD * 2)
    return [x, y]
  })

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const fillPath = `${linePath} L${W} ${H} L0 ${H} Z`

  return (
    <div className={cls}>
      <svg className="Sparkline__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Change over the period">
        {showFill && (
          <path className={`Sparkline__fill Sparkline__fill--${tone}`} d={fillPath} />
        )}
        <path className={`Sparkline__line Sparkline__line--${tone}`} d={linePath} fill="none" />
        {showDots && points.map(([x, y], i) => (
          <circle key={i} className={`Sparkline__dot Sparkline__dot--${tone}`} cx={x} cy={y} r="3" />
        ))}
      </svg>
    </div>
  )
}
