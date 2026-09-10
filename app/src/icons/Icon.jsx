import { createElement } from 'react'
import { ICONS } from './paths.js'
import './Icon.css'

/**
 * L1 · Icon
 *
 * Sizing contract (Figma):
 *   W=fixed(size)  H=fixed(size)  pad 0  gap 0
 *   flex: 0 0 auto — the icon NEVER shrinks (FIGMA_RULES §3)
 *
 * props:
 *   name  — a key from ICONS (64)
 *   size  — 16 | 20 | 24 | 32
 *   tone  — default | dim | faint | accent | success | danger | warning | inverse | inherit
 */
export function Icon({ name, size = 24, tone = 'inherit', className = '', ...rest }) {
  const icon = ICONS[name]

  if (!icon) {
    if (import.meta.env.DEV) throw new Error(`Icon: unknown name "${name}"`)
    return null
  }

  const cls = ['Icon', `Icon--${size}`, `Icon--${tone}`, className].filter(Boolean).join(' ')
  const filled = icon.fill === true

  const shared = filled
    ? { fill: 'currentColor', stroke: 'none' }
    : {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 'var(--icon-stroke)',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }

  const children = icon.el
    ? icon.el.map(([tag, attrs], i) => createElement(tag, { key: i, ...shared, ...attrs }))
    : [createElement('path', { key: 0, ...shared, d: icon.d })]

  return (
    <svg className={cls} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
      {children}
    </svg>
  )
}
