# Tenni Wallet — component registry

Every component is described by a sizing contract (see `FIGMA_RULES.md` §5) —
exactly what a designer sets by hand in Figma Auto Layout.

Notation: `W`/`H` — width/height. `hug` = Hug contents, `fill` = Fill container,
`N` = fixed N px.

---

## L0 · Tokens

| Group | Prefix | Values |
|---|---|---|
| Color — primitives | `--c-*` | ball, court, clay, night court, chalk, neutrals, assets, card |
| Color — semantic | `--bg-*`, `--fg-*`, `--border-*`, `--accent-*`, status | two modes: Dark / Light |
| Typography | `--font-*`, `--text-*` | 10 styles, line-height in px |
| Spacing (4-pt) | `--space-0..64` | 13 |
| Radii | `--r-*` | 7 |
| Shadows | `--shadow-*` | 5 |
| Control sizes | `--control-*`, `--icon-*` | 8 |
| Motion | `--dur-*`, `--ease-*` | 7 |

Palette concept — the tennis ball: **ball** `#C8FF4D` (accent, up), **court**
`#7BD389` / **moss** `#2F5A3A` (surfaces, the card), **court shadow** `#0A1208`
(dark canvas), **clay** `#FF7B5C` (down, errors). The light theme is monochrome
on purpose — lime on paper is 1.2:1 — so ink `#1A1A1F` takes the accent role and
"up" is the ball darkened to olive `#4D7A00`.

---

## L1 · Primitives

### Icon
The only way to render an icon.
```
row · W=fixed(size) H=fixed(size) · flex: 0 0 auto
props: name (64), size (16|20|24|32), tone (default|dim|faint|accent|success|danger|warning|inherit)
```

### Text
Guarantees there are no stray font sizes.
```
W=hug|fill · H=hug · pad 0 · margin 0
props: variant (display|h1|h2|h3|title|body|bodySm|label|caption|mono),
       tone (default|dim|faint|accent|success|danger|warning|inverse),
       align (start|center|end), truncate (bool), numeric (tabular-nums)
```

### Divider
```
row · W=fill H=fixed(1)
props: inset (0|16|56 — left inset for an avatar)
```

### Layer
The only legal way to put one block on top of another.
```
column · W=fill H=hug (the in-flow child sets the height)
├ children — base layer, in flow
└ over     — slot, out of flow (Figma: Absolute position)
props: over (ReactNode), anchor (bottom|top|top-right|center|stack),
       inset (0|8|12|16|20), offset ('X Y' — stack only)
```
`anchor="stack"` is the card fan on Home: the base is shifted by (X, Y) with
the Layer's own padding, `over` spans from the top-left to X on the right at
full height — glass in front, the card peeking out on the right. In Figma: an
Auto Layout frame with padding L=X T=Y plus an absolute layer with constraints
L0 T0 R=X B0.

### Surface
The base card: background + radius + border + shadow.
```
column · W=fill H=hug (fill → H=fill) · pad 16 · gap 12
props: level (0|1|2|3), radius (md|lg|xl|2xl), interactive (bool), glass (bool), fill (bool)
```

---

## L2 · Controls

### Button
```
row · W=hug (fill via modifier) · H=fixed(by size)
pad: sm 0/12 · md 0/16 · lg 0/20 · xl 0/24 · gap 8 · center/center
```

| Property | Type | Values |
|---|---|---|
| `variant` | Variant | `primary` · `secondary` · `ghost` · `outline` · `danger` · `success` · `link` |
| `size` | Variant | `sm` (32) · `md` (40) · `lg` (48) · `xl` (56) |
| `state` | Variant | `default` · `hover` · `pressed` · `focus` · `disabled` · `loading` |
| `iconLeading` / `iconTrailing` | Boolean + Instance swap | — |
| `label` | Text | — |
| `fullWidth` | Boolean | W: hug → fill |

Height is pinned three ways (`height = min-height = max-height`): `fullWidth`
carries `flex: 1 1 auto`, which is right in a row but would stretch or crush
the button's height inside a column.

| variant | When | Example |
|---|---|---|
| `primary` | The main action of a screen, exactly one | Send, Confirm |
| `secondary` | The alternative next to primary | Receive |
| `ghost` | Tertiary, inside dense blocks | See all |
| `outline` | On a colored surface or a card | Top up |
| `danger` | Irreversible | Unlink card, Delete wallet |
| `success` | Confirmation inside a success state | Done |
| `link` | Inline in text | Already have an account? |

### IconButton
```
row · W=fixed(size) H=fixed(size) · center
props: variant (ghost|solid|outline), size (32|40|48), icon, badge (bool)
```
Touch target is at least 44×44 at every size (pseudo-element).

### Input
```
column · W=fill H=hug · gap 6
├ label      Text/label
├ field      row · W=fill H=fixed(48) · pad 0/16 · gap 8
│  ├ icon?   fixed(20)
│  ├ input   fill · min-width 0
│  └ action? hug — slot for Paste / Scan
└ hint/error Text/bodySm (a sentence, not a tag)
props: type (text|amount|card|cvc|expiry|address|search|pin),
       state (default|focus|filled|error|success|disabled|readonly),
       iconLeading, iconTrailing, action (slot), hint, error
```
Masks (`inputMasks.js`, pure functions): card `#### #### #### ####`,
expiry `MM/YY`, cvc 3–4 digits, amount — comma thousands and a dot decimal.
Address fields are monospace and never truncated while editing.

### Toggle
```
row · W=fixed(52) H=fixed(32) · pad 4 · thumb fixed(24)
props: state (off|on|disabled-off|disabled-on|focus)
```

### Checkbox / Radio
```
W=fixed(22) H=fixed(22)
props: state (unchecked|checked|indeterminate — Checkbox only|disabled|error)
```

### Segmented
```
row · W=fill H=fixed(40) · pad 4 · gap 2
props: items (2|3|4), active (index)
```

### Chip
```
row · W=hug H=fixed(32|24) · pad 0/12 · gap 6
props: variant (neutral|accent|success|danger|warning|outline),
       size (sm 24|md 32), icon, removable, selected
```

### Badge
```
W=hug(min 18) H=fixed(18) · pad 0/6
props: variant (dot|count), tone (accent|danger)
```
Positioned by the parent (`IconButton__badge`), not by itself.

### Keypad
```
column · W=fill H=hug · gap 8
└ row ×4 · gap 8 └ key ×3 · fill · H=fixed(56)
props: mode (amount — decimal point | pin — biometric key), showBiometric
```

### Slider
```
column · W=fill H=hug · gap 8
props: state (default|active|disabled), showTicks, showValue
```
Value fill is `width: calc(1% * var(--pct))` — a value, not a layout percentage.

---

## L3 · Data display

### Avatar
```
W=fixed(size) H=fixed(size) · radius full
props: size (28|36|40|48|56), type (image|initials|icon|asset), ring, badge
```

### AssetIcon
```
W=fixed(size) H=fixed(size)
props: symbol (btc|eth|usdt|sol|bnb|… — unknown → monogram), size (24|32|40), chainBadge
```

### Amount
One place for the rule "up and down are never color alone".
```
row · W=hug H=hug · gap 4 · baseline
props: value, currency (prefix), suffix (" BTC", "%"), precision (default 2),
       size (sm|md|lg|xl), sign (none|plus|minus), tone (auto|up|down|neutral),
       showArrow (▲/▼), masked (••••)
```
`precision` exists because 2 decimals would round 0.005 BTC to 0.01.

### Balance
```
column · W=hug H=hug · gap 6 · align center|start
├ row: label + IconButton(eye)
├ Text/display — amount
└ row: Amount(delta) + Chip(period)
props: value, masked, loading, delta, period, align
```

### ListRow
```
row · W=fill H=fixed(68 | 56 for sm) · pad 0/16 · gap 12 · center
├ leading   hug            slot
├ body      fill min-w 0   column · gap 2 — title (truncate), subtitle (truncate)
├ trailing  hug            column · align end · gap 2 — slot + meta
└ chevron?  fixed(20)
props: leading, trailing — slots (Instance swap); title, subtitle, meta — Text;
       chevron, divider — Boolean; size (sm|md);
       state (default|pressed|selected|disabled|swiped)
```
`state="swiped"`: the gesture doesn't transfer to Figma, the open state does.

### TransactionRow — a ListRow preset
```
props: type (sent|received|paid|swapped|staked) → icon, tone and sign,
       title, subtitle, value, currency, unit, precision,
       state (pending|failed)
```
Outgoing money is neutral, incoming is "up", failures are clay.
`pending`/`failed` are data states — they change the icon, tone and caption,
not the row's visual state.

### Sparkline
```
W=fill H=fixed(64)
props: data, tone (up|down|neutral), showFill, showDots, state (default|loading|empty)
```
A flat series (`range === 0`) draws a centered line instead of `NaN`.

### Donut
```
W=fixed(160) H=fixed(160)
props: segments[], showCenter, thickness (12|16)
```

### Skeleton
```
props: shape (line|circle|rect), w, h, radius
```
Used inside components while loading, not instead of them.

### ProgressDots
```
row · W=hug H=fixed(8) · gap 6
props: total, active
```

### QRBlock
```
column · W=hug H=hug · pad 20 · gap 16 · center
props: value, size (200|240), withLogo, logo (slot), state (default|loading|expired), showValue
```
The caption is `mono`, never uppercase — an ETH address's case is part of its
EIP-55 checksum. The pattern is decorative and deterministic; a real encoder
plugs in at integration.

### CardVisual
```
column · W=fill H=fixed(200) · pad 20 · space-between
props: skin (auto|dark|light|glass), kind (debit|credit|prepaid),
       last4, holder, expiry, masked, state (active|frozen|expired)
```
The card only — the "Pay with" composer on Home is assembled on the screen and
stacked with `Layer`. The corner shows the card **type**, not a network
mark: printing VISA on the card would claim a partnership that doesn't exist.

---

## L4 · Feedback

### Toast
```
row · W=fill H=hug · pad 12/16 · gap 12 · radius lg
props: tone (info|success|warning|danger), icon, action, dismissible
```
The card only — position, stacking and the timer belong to the screen.

### Banner
```
row · W=fill H=hug · pad 12/16 · gap 8
props: tone, title, body, action
```
Inline in the screen flow: no connection, not enough funds, the rate changed.

### Modal
```
column · W=fixed(320) H=hug · pad 24 · gap 16 · radius xl · center
props: icon, title, body, actions ([{label, variant, onClick}], 1|2), tone (neutral|danger)
```
The panel only; the scrim is a separate frame in the scene.

### BottomSheet
```
column · W=fill H=hug · pad 8/20/24 · gap 16 · radius top xl
├ grabber fixed(36×4) ├ header ├ content fill └ actions row · gap 12
props: size (auto|half|full), grabber, header, title, onClose, actions
```

### EmptyState
```
column · W=fill H=hug · pad 32/24 · gap 16 · center
props: illustration (slot), icon (fallback), title, body, action, actionLabel, onAction
```
Also used for result screens (processing / paid / declined / sent).

### LockOverlay
```
column · W=fill H=fill · center · gap 24
props: method (faceid|touchid|pin), state (idle|scanning|success|failed),
       onRetry, onUseFallback, fallbackLabel
```
Fills the container the screen gives it; drives the Face ID step in Send.

### Illustration
```
W=fixed(size) H=fixed(size) · 120×120 canvas
props: name (empty-balance|empty-activity|offline|no-results|no-cards|generic), size
```
Background circle r=46 in `--accent-subtle`, 2.5 round stroke, exactly one
accent element per drawing, token colors only.

---

## L5 · Navigation and frame

### StatusBar
```
row · W=fill H=fixed(54) · pad 0/24 · space-between
props: theme (dark|light) — a literal color, not the app theme
```

### AppBar
```
row · W=fill H=fixed(56) · pad 0/16 · gap 12 · center
├ leading hug slot ├ center fill Text/title └ trailing hug slot
props: leading, trailing, onBack (shortcut), title, layout (title-left|title-center), transparent
```
`title-center` centers in the space between the slots; keep both sides
symmetric when exact centering matters. Empty slots are kept only in
`title-center`, so a `title-left` title sits on the content edge.

### TabBar / NavItem
```
TabBar: row · W=fill H=fixed(64) · pad 0/8 └ NavItem × n · fill
NavItem: column · W=fill H=fill · gap 4 · center
props: items, active, onChange, theme (solid|glass), labels · NavItem state (default|active|disabled), badge
```

### Screen
```
column · W=fixed(390) H=fixed(844) · radius 44 · clip
├ StatusBar fixed(54) ├ appBar? slot ├ content fill · scroll · min-height 0
├ tabBar? slot └ HomeIndicator fixed(34)
props: theme, size (mock|fluid), statusBar, appBar, tabBar, homeIndicator,
       safeTop, scroll, contentPadding
```
`theme` sets `data-theme` on the screen itself, so a dark screen can live in a
light page. Safe areas apply only when the mock bars are off. `fluid` makes the
same component the real app shell. The phone bezel is not part of Screen.

### Section (screen component)
```
column · W=fill H=hug · gap 12
├ header row · space-between: Text/h3 + Button/ghost └ content
props: title, action, actionLabel, onAction, padding (0|16)
```

---

## Summary

| Level | Components |
|---|---|
| L1 Primitives | 6 — Icon, Text, Stack, Divider, Layer, Surface |
| L2 Controls | 11 — Button, IconButton, Input, Toggle, Checkbox, Radio, Segmented, Chip, Badge, Keypad, Slider |
| L3 Data display | 12 — Avatar, AssetIcon, Amount, Balance, Skeleton, Sparkline, Donut, ProgressDots, QRBlock, ListRow, TransactionRow, CardVisual |
| L4 Feedback | 6 — Toast, Banner, Modal, BottomSheet, EmptyState, LockOverlay (+ 6 illustrations) |
| L5 Navigation | 7 — StatusBar, AppBar, TabBar, NavItem, HomeIndicator, Section, Screen |
| **Total** | **42** |

Plus 64 icons in 6 packs and 10 type styles.
