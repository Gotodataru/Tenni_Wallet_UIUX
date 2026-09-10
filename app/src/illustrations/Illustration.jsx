import './Illustration.css'

/**
 * Empty-state illustrations — 6 of them
 *
 * Family rules, so the set reads as one kit:
 *  • 120×120 canvas, the object takes ~72px in the middle
 *  • a shared r=46 background circle in --accent-subtle
 *  • 2.5 stroke, round caps/joins, --fg-dim
 *  • EXACTLY ONE accent element per drawing (--accent) — where the eye
 *    lands; two accents in one picture break the hierarchy
 *  • no fills except the accent and dots — same logic as the icon
 *    packs: stroke geometry, not illustrative painting
 *
 * Plugs into EmptyState through the `illustration` slot — the component
 * API didn't change, it accepted a ReactNode from the start.
 */

const SHAPES = {
  /* Empty balance — a wallet with a clasp */
  'empty-balance': (
    <>
      <rect className="Illu__line" x="24" y="44" width="72" height="46" rx="10" />
      <path className="Illu__line" d="M24 60h72" />
      <rect className="Illu__accent" x="74" y="68" width="16" height="11" rx="5.5" />
    </>
  ),

  /* Empty activity — a list trailing off */
  'empty-activity': (
    <>
      <circle className="Illu__accent" cx="34" cy="42" r="7" />
      <path className="Illu__line" d="M50 42h40" />
      <g className="Illu__fade1">
        <circle className="Illu__line" cx="34" cy="62" r="7" />
        <path className="Illu__line" d="M50 62h32" />
      </g>
      <g className="Illu__fade2">
        <circle className="Illu__line" cx="34" cy="82" r="7" />
        <path className="Illu__line" d="M50 82h24" />
      </g>
    </>
  ),

  /* Offline — a crossed-out signal */
  offline: (
    <>
      <path className="Illu__line" d="M26 64Q60 30 94 64" />
      <path className="Illu__line" d="M38 73Q60 50 82 73" />
      <path className="Illu__line" d="M49 81Q60 70 71 81" />
      <circle className="Illu__dot" cx="60" cy="88" r="4.5" />
      <path className="Illu__accentLine" d="M32 32 88 94" />
    </>
  ),

  /* No results — a magnifier with nothing inside */
  'no-results': (
    <>
      <circle className="Illu__line" cx="54" cy="52" r="22" />
      <path className="Illu__line" d="M45 52h18" />
      <path className="Illu__accentLine" d="M70 68 88 86" />
    </>
  ),

  /* No cards — a dashed card with a plus */
  'no-cards': (
    <>
      <rect className="Illu__dashed" x="24" y="42" width="72" height="48" rx="10" />
      <path className="Illu__accentLine" d="M60 56v24M48 68h24" />
    </>
  ),

  /* Generic — an open box */
  generic: (
    <>
      <path className="Illu__line" d="M30 58h60v24a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6Z" />
      <path className="Illu__line" d="M30 58 45 43M90 58 75 43" />
      <circle className="Illu__accent" cx="60" cy="38" r="7" />
    </>
  ),
}

export const ILLUSTRATION_NAMES = Object.keys(SHAPES)

export function Illustration({ name = 'generic', size = 120, blob = true, className = '', ...rest }) {
  const shape = SHAPES[name]

  if (!shape) {
    if (import.meta.env.DEV) throw new Error(`Illustration: unknown name "${name}"`)
    return null
  }

  return (
    <svg
      className={['Illu', className].filter(Boolean).join(' ')}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {blob && <circle className="Illu__blob" cx="60" cy="60" r="46" />}
      {shape}
    </svg>
  )
}
