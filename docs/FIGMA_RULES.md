# Layout rules for Figma Auto Layout

> Any component that breaks these rules will fall apart when imported into
> Figma: text stretches, icons squash, spacing disappears. `npm run check:figma`
> checks them on every build.

---

## 0. Why these constraints

Components are built in HTML/CSS and then brought into Figma by capturing the
rendered page (the `html.to.design` plugin, or Figma's own code-to-canvas
capture). The capture converts CSS flexbox into native **Auto Layout** — but
only for the subset of CSS that has a direct Figma equivalent. Everything else
becomes absolutely positioned layers that have to be redrawn by hand.

So the system is built on **the subset of CSS = Figma Auto Layout**.

---

## 1. CSS ↔ Figma mapping

| Figma | CSS | Note |
|---|---|---|
| Auto Layout · Vertical | `display:flex; flex-direction:column` | |
| Auto Layout · Horizontal | `display:flex; flex-direction:row` | |
| Auto Layout · Wrap | `flex-wrap:wrap` | |
| Gap between items | `gap: Npx` | **gap only**, never margin |
| Padding | `padding: Npx` | |
| Alignment (9 points) | `justify-content` + `align-items` | |
| Space between | `justify-content: space-between` | |
| **Hug contents** | `width: fit-content` / default | |
| **Fill container** | `flex: 1 1 0; min-width: 0` | along the main axis |
| **Fill (cross axis)** | `align-self: stretch` | |
| **Fixed** | `width/height: Npx` + `flex: 0 0 auto` | |
| Clip content | `overflow: hidden` | |
| Corner radius | `border-radius` | |
| Stroke (inside) | `box-shadow: inset 0 0 0 1px C` | preferred over `border` |
| Stroke (center/outside) | `border` | changes the box size |
| Drop shadow | `box-shadow: 0 Y B S C` | |
| Layer blur | `filter: blur()` | |
| Background blur | `backdrop-filter: blur()` | the glass layer |
| Absolute position (inside AL) | `position:absolute` on a child | **marked only** |
| Text · Auto width | `white-space: nowrap; width: fit-content` | |
| Text · Auto height | width fixed/fill, `height:auto` | |
| Truncate text | `overflow:hidden; text-overflow:ellipsis` | |
| Variant property | a CSS modifier class | `.Button--primary` |

---

## 2. Hard rules

### ❌ No `margin`
Figma Auto Layout has no margin — only the parent's padding and the gap
between children. The one exception is `margin: 0` to reset browser defaults.

```css
/* bad */  .title { margin-bottom: 16px; }
/* good */ .section { display:flex; flex-direction:column; gap:16px; }
```

### ❌ No percentages in sizes
Figma has no `width: 50%`, it has Fill container. Exceptions: `border-radius: 50%`
and percentages inside gradients.

**Value fill** is a second exception: a fill whose width shows a number, not a
layout (the filled part of `Slider`, a progress bar). In Figma this is a width
bound to a Number variable. It is written as `width: calc(1% * var(--pct))`,
never a literal `NN%`, so the linter can tell it from a layout percentage.

### ❌ No unmarked `position: absolute`
Allowed only where Figma will get an explicit "Absolute position": a badge dot,
a glass layer over a card. Such elements carry an `is-abs` comment explaining why.

### ❌ No `float`, `position: fixed/sticky`, CSS Grid
Grid has no Figma equivalent. Two columns are two `flex: 1 1 0` children of a row.

### ❌ No magic numbers
Every size and gap comes from the token scale: `padding: var(--space-12)`, not `padding: 13px`.

### ❌ No unitless `line-height`
Figma stores line height as an absolute value. Write `line-height: 20px`.

---

## 3. Required patterns

### ✅ Icons never shrink
```css
.icon { width:24px; height:24px; flex:0 0 auto; }
```

### ✅ Text in a row always has `min-width: 0`
```css
.row__text { flex:1 1 0; min-width:0; }
```
Without it a long wallet address breaks the whole row. In Figma: Fill container + Truncate text.

### ✅ Full width is a modifier
`Button--fullWidth`, never `width: 100%`.

### ✅ Control heights come from the scale
32 / 40 / 48 / 56, set with `height`, not with padding — otherwise buttons in
one row end up with different heights.

### ✅ Every component is a self-contained flex container
No `.parent .child` selectors that change layout. In Figma a component is an isolated frame.

---

## 4. Layer naming

Class names are written so the import produces the right Figma layer names.

```
Component:  .Button            →  Figma: Button
Variant:    .Button--primary   →  Variant=Primary
Size:       .Button--md        →  Size=Md
State:      .is-disabled       →  State=Disabled
Part:       .Button__label     →  layer "label"
```

BEM here is not taste, it is transport: `Block__element--modifier` maps one-to-one
onto a Figma component's structure.

---

## 5. Sizing contract

Every component in `COMPONENTS.md` is described in three lines — what a designer sets in Figma:

```
Direction: row | column
Sizing:    W=hug|fill|fixed(N)  H=hug|fill|fixed(N)
Padding / Gap
```

---

## 6. The linter

```bash
npm run check:figma
```

Fails the build if it finds in any stylesheet:
- `margin` other than `margin: 0`
- `%` in `width` / `height`
- `position: absolute` without an `is-abs` note
- `display: grid`
- unitless `line-height`
- a hard-coded color outside `tokens/`
- a numeric literal in `padding` / `gap` / `border-radius` instead of `var(--*)`

---

## 7. Import pipeline

1. **Tokens** → Figma Variables: two collections, `palette` and `theme` with Dark/Light modes.
2. **Icons** → export each icon as SVG → drag into Figma → Create multiple components →
   a set with an instance-swap property.
3. **Components** → run the catalog, capture one section at a time.
   Auto Layout arrives on its own because the layout follows the rules above.
4. **Manual pass** (~20% of the time): rename layers, Combine as variants,
   bind colors to Variables. No capture tool does this — it produces frames, not a library.
5. **Publish** the library → assemble screens from instances.

The point of every constraint above is to turn step 4 from "redraw everything"
into "rename and combine".
