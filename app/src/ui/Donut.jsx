import { Text } from './Text.jsx'
import './Donut.css'

/**
 * L3 · Donut
 *
 * Sizing contract (Figma): W=fixed(160) H=fixed(160)
 * props: segments — [{ value, color }] (color — a CSS var, e.g. 'var(--c-btc)'),
 *        showCenter (bool), thickness (12|16)
 */
const SIZE = 160

export function Donut({ segments = [], showCenter = false, centerLabel, centerValue, thickness = 16, className = '' }) {
  const radius = (SIZE - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1

  // Each arc starts where the previous ones end: offset = −(sum of earlier dashes).
  const dashes = segments.map((seg) => (seg.value / total) * circumference)
  const arcs = segments.map((seg, i) => ({
    ...seg,
    key: i,
    dash: dashes[i],
    gap: circumference - dashes[i],
    offset: -dashes.slice(0, i).reduce((sum, d) => sum + d, 0),
  }))

  return (
    <div className={['Donut', className].filter(Boolean).join(' ')}>
      <svg className="Donut__svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Portfolio allocation">
        {/* -90° — the first segment starts at 12 o'clock, not at 3 */}
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          <circle
            className="Donut__track"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={radius}
            strokeWidth={thickness}
            fill="none"
          />
          {arcs.map((arc) => (
            <circle
              key={arc.key}
              className="Donut__segment"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={radius}
              strokeWidth={thickness}
              fill="none"
              stroke={arc.color}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={arc.offset}
            />
          ))}
        </g>
      </svg>

      {showCenter && (
        <div className="Donut__center">
          {centerValue && <Text variant="h3" numeric>{centerValue}</Text>}
          {centerLabel && <Text variant="caption" tone="dim">{centerLabel}</Text>}
        </div>
      )}
    </div>
  )
}
