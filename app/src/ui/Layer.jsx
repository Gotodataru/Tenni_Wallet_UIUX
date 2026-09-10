import './Layer.css'

/**
 * L1 · Layer — the only legal way to put one block on top of another
 *
 * ── Why it exists ─────────────────────────────────────────────────
 * Home needed the payment composer on top of the card, and the system
 * had no way to overlap blocks. Writing `position: absolute` inline on
 * the screen would bypass the linter and the `is-abs` discipline, so the
 * rule "missing piece = system bug" kicked in: stop, add a component.
 *
 * Sizing contract (Figma):
 *   column · W=fill · H=hug (set by the in-flow content)
 *   ├ children — base layer, IN FLOW, sets the height
 *   └ over     — slot, OUT OF FLOW (Figma: Absolute position)
 *
 * props: over (ReactNode), anchor (bottom|top|top-right|center|stack),
 *        inset (0|8|12|16|20 — inset from the edge, 4-pt scale),
 *        offset ('X Y' — stack only: X 16|24|32|48|64, Y 8|12|16|24|32)
 *
 * Direct Figma equivalent: a frame with two children, the second one
 * set to Absolute position with constraints on the chosen edge.
 *
 * ── anchor="stack" — a fan of cards ───────────────────────────────
 * The Home composition isn't "composer inside the card" but a fan: the
 * glass panel in front on the left, the card behind it shifted right
 * and down, its strip with the type (DEBIT) and expiry peeking out.
 * The other anchors keep over INSIDE the base, covering most of it.
 * stack shifts the base diagonally and puts over in its place:
 *   base (card) shifted by offset — the Layer's own padding;
 *   over (glass) — from the top-left to X on the right, full height: inset 0 X 0 0.
 * Figma: an Auto Layout frame with padding L=X T=Y holding the card; the
 * glass is Absolute position with constraints L=0 T=0 R=X B=0. The
 * content of over fills its height via `Surface fill`.
 */
export function Layer({ over, anchor = 'bottom', inset = 0, offset = '64 24', children, className = '', ...rest }) {
  const isStack = anchor === 'stack'
  const [ox, oy = ox] = String(offset).trim().split(/\s+/)
  const cls = ['Layer', isStack && `Layer--stack Layer--ox-${ox} Layer--oy-${oy}`, className].filter(Boolean).join(' ')
  const overCls = ['Layer__over', `Layer__over--${anchor}`, !isStack && `Layer__over--inset-${inset}`].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      {children}
      {over && <div className={overCls}>{over}</div>}
    </div>
  )
}
