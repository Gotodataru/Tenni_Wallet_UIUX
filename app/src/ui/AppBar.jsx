import { Text } from './Text.jsx'
import { IconButton } from './IconButton.jsx'
import './AppBar.css'

/**
 * L5 · AppBar
 *
 * Sizing contract (Figma):
 *   row · W=fill H=fixed(56) · pad 0/16 · gap 12 · align center
 *   ├ leading   hug   slot (IconButton back | Avatar | logo | none)
 *   ├ center    fill  Text/title
 *   └ trailing  hug   row · gap 8 · slot ×0–2
 *
 * props: leading (slot), title, layout (title-left|title-center),
 *        trailing (slot), transparent (bool), onBack
 *
 * `leading`/`trailing` are slots (like ListRow), not an enum: sometimes
 * it's a back IconButton, sometimes an Avatar, sometimes a logo.
 * `onBack` is the one shortcut — going back is common enough to deserve
 * its own prop.
 *
 * ⚠ `layout="title-center"` centers the title in the REMAINING space
 * between leading and trailing (center=fill, leading/trailing=hug),
 * not optically across the whole bar. If the sides differ in width
 * (a back button but nothing on the right), the title shifts. The
 * classic iOS trick — reserving equal width on both sides — is left
 * out on purpose: the contract asks for hug slots. Keep the sides
 * symmetric on the screen when exact centering matters.
 */
export function AppBar({
  leading,
  onBack,
  title,
  layout = 'title-left',
  trailing,
  transparent = false,
  className = '',
  ...rest
}) {
  const cls = ['AppBar', transparent && 'AppBar--transparent', className].filter(Boolean).join(' ')
  const resolvedLeading = leading || (onBack && <IconButton variant="ghost" icon="chevron-left" onClick={onBack} aria-label="Back" />)

  // An empty slot keeps its place (min-width 40) for SYMMETRY — only needed
  // in title-center. In title-left an empty leading just pushed the title
  // off the content grid (16 + 40 + 12 = 68pt instead of 16), so empty
  // slots aren't rendered there and the title sits on the content edge.
  const keepEmpty = layout === 'title-center'

  return (
    <div className={cls} {...rest}>
      {(resolvedLeading || keepEmpty) && <span className="AppBar__leading">{resolvedLeading}</span>}

      <span className={`AppBar__center AppBar__center--${layout}`}>
        {title && <Text variant="title" truncate align={layout === 'title-center' ? 'center' : 'start'}>{title}</Text>}
      </span>

      {(trailing || keepEmpty) && <span className="AppBar__trailing">{trailing}</span>}
    </div>
  )
}
