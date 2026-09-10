import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import { Skeleton } from './Skeleton.jsx'
import './QRBlock.css'

/**
 * L3 · QRBlock
 *
 * Sizing contract (Figma): column · W=hug H=hug · pad 20 · gap 16 · align center
 * props: value (string — what to encode), size (200|240), withLogo (bool),
 *        logo (slot — what sits in the center, e.g. the asset icon),
 *        state (default|loading|expired),
 *        showValue (bool, default true — Figma: Boolean property). Receive
 *        turns it off: it shows the full address in its own card, and a
 *        truncated caption under the code would be a second copy.
 *
 * The value caption is mono, never caption: caption is set in caps, and
 * an uppercased address is corrupted data (an ETH address's case is
 * part of its EIP-55 checksum; "0X4A9F…" is a different string).
 *
 * ⚠ This is NOT a real QR code — the pattern is decorative and
 * deterministic (the same value always draws the same pattern, so
 * screenshots stay stable). Real encoding needs a library such as
 * `qrcode` and is plugged in when the screen ships, not in the
 * design system.
 */
const MODULES = 21   // like QR version 1 — familiar proportions

function seededPattern(seed, n) {
  // xorshift32 over the string — deterministic noise, not crypto-grade;
  // only the repeatability of the picture matters here.
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const cells = []
  for (let i = 0; i < n * n; i++) {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5
    cells.push((h & 1) === 1)
  }
  return cells
}

function isFinderZone(row, col, n) {
  const inCorner = (r, c) => r < 7 && c < 7
  return inCorner(row, col) || inCorner(row, n - 1 - col) || inCorner(n - 1 - row, col)
}

export function QRBlock({ value = 'demo', size = 200, withLogo = false, logo, state = 'default', showValue = true, className = '' }) {
  const cls = ['QRBlock', className].filter(Boolean).join(' ')

  if (state === 'loading') {
    return (
      <div className={cls}>
        <Skeleton shape="rect" w={size} h={size} radius="var(--r-lg)" />
      </div>
    )
  }

  const cells = seededPattern(value, MODULES)

  return (
    <div className={cls}>
      <div className="QRBlock__frame" style={{ width: size, height: size }}>
        <svg className="QRBlock__svg" viewBox={`0 0 ${MODULES} ${MODULES}`}>
          {cells.map((on, i) => {
            const row = Math.floor(i / MODULES)
            const col = i % MODULES
            if (isFinderZone(row, col, MODULES) || !on) return null
            return <rect key={i} x={col} y={row} width={1} height={1} className="QRBlock__cell" />
          })}
          {[[0, 0], [0, MODULES - 7], [MODULES - 7, 0]].map(([r, c]) => (
            <g key={`${r}-${c}`} transform={`translate(${c} ${r})`}>
              <rect x={0} y={0} width={7} height={7} className="QRBlock__finderOuter" />
              <rect x={1} y={1} width={5} height={5} className="QRBlock__finderMid" />
              <rect x={2} y={2} width={3} height={3} className="QRBlock__finderInner" />
            </g>
          ))}
        </svg>

        {withLogo && (
          <div className="QRBlock__logo" aria-hidden="true">
            {logo || <Icon name="stake" size={20} tone="inherit" />}
          </div>
        )}

        {state === 'expired' && (
          <div className="QRBlock__overlay">
            <Icon name="refresh" size={24} tone="inverse" />
            <Text variant="label" tone="inverse">Code expired</Text>
          </div>
        )}
      </div>

      {showValue && <Text variant="mono" tone="dim" truncate style={{ maxWidth: size }}>{value}</Text>}
    </div>
  )
}
