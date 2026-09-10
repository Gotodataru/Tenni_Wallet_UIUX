import { Icon } from '../icons/Icon.jsx'
import { Text } from './Text.jsx'
import './ListRow.css'

/**
 * L3 · ListRow — the most reused component after Button
 *
 * Activity, Settings, Profile, Send, Receive and Pay are built on it,
 * so the API maps one-to-one onto Figma Component Properties.
 *
 * Sizing contract (Figma):
 *   row · W=fill · H=fixed(68 | 56 for size="sm") · pad 0/16 · gap 12 · align center
 *   ├ leading   hug (usually 40)   slot
 *   ├ body      fill · min-width 0 · column · gap 2
 *   │   ├ title    Text/body   truncate
 *   │   └ subtitle Text/caption truncate
 *   ├ trailing  hug · column · align end · gap 2
 *   │   ├ (slot) Amount | Toggle | Text | …
 *   │   └ meta   Text/caption
 *   └ chevron?  fixed(20)
 *
 * ── Why slots, not a list of types ────────────────────────────────
 * The first spec said `leading (avatar|asset|icon|none)`. It is built
 * with slots (`leading={<Avatar/>}`) because in Figma that is an
 * **Instance swap property** — which is exactly a slot. An enum would
 * force ListRow to know the props of Avatar, AssetIcon and Checkbox
 * and pass them all through — Figma has no equivalent for that.
 *
 * Strings (`title`, `subtitle`, `meta`) stay plain props — Text
 * properties in Figma. Booleans (`chevron`, `divider`) are Boolean
 * properties. Every prop has an exact Figma type.
 *
 * ── Beyond the first spec ─────────────────────────────────────────
 * • `size` (sm 56 | md 68) — a single-line row with a toggle
 *   (Settings) looks loose at 68px and needs 56. A variant, not a
 *   new component.
 * • `state="swiped"` instead of `swipeable (bool)`: the gesture
 *   doesn't transfer to Figma, the OPEN state does. So this is a
 *   static variant with the action revealed; the gesture itself is
 *   wired on the screen.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  meta,
  chevron = false,
  divider = false,
  size = 'md',
  state,
  swipeAction,
  onClick,
  className = '',
  ...rest
}) {
  const interactive = Boolean(onClick)
  const isDisabled = state === 'disabled'
  const Tag = interactive && !isDisabled ? 'button' : 'div'

  const cls = [
    'ListRow',
    `ListRow--${size}`,
    state && `is-${state}`,
    divider && 'ListRow--divider',
    interactive && 'is-interactive',
    className,
  ].filter(Boolean).join(' ')

  const row = (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      className={cls}
      onClick={isDisabled ? undefined : onClick}
      disabled={Tag === 'button' && isDisabled ? true : undefined}
      aria-current={state === 'selected' ? 'true' : undefined}
      {...rest}
    >
      {leading && <span className="ListRow__leading">{leading}</span>}

      <span className="ListRow__body">
        <Text variant="body" truncate>{title}</Text>
        {subtitle && <Text variant="bodySm" tone="dim" truncate>{subtitle}</Text>}
      </span>

      {(trailing || meta) && (
        <span className="ListRow__trailing">
          {trailing}
          {meta && <Text variant="caption" tone="faint">{meta}</Text>}
        </span>
      )}

      {chevron && <Icon name="chevron-right" size={20} tone="faint" className="ListRow__chevron" />}
    </Tag>
  )

  // Open swipe state: the action sits UNDER the row, the row is shifted.
  if (state === 'swiped' && swipeAction) {
    return (
      <span className="ListRow__swipe">
        <span className="ListRow__swipeAction">{swipeAction}</span>
        {row}
      </span>
    )
  }

  return row
}
