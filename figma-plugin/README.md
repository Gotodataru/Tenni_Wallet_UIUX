# Tenni Tokens — Figma plugin

Step 1 of the import pipeline (`docs/FIGMA_RULES.md` §7): the CSS tokens become
Figma Variables and styles. The CSS stays the source of truth — the plugin is
generated from it.

```bash
cd app
npm run figma:tokens   # src/tokens/*.css → figma-plugin/code.js
```

In Figma desktop: **Plugins → Development → Import plugin from manifest…** →
`figma-plugin/manifest.json`, then run **Tenni Tokens**. Re-running updates
values by name, nothing is duplicated.

| Result | From |
|---|---|
| Collection `palette` — primitives, hidden from pickers and publishing | `palette.css` |
| Collection `scale` — spacing, radii, sizes, type, motion, with scopes | `scale.css` |
| Collection `theme` — modes **Dark** / **Light**, aliases to `palette` | `semantic.css` |
| 10 text styles bound to the `scale` type variables | `--text-*` |
| Effect styles `Dark/*`, `Light/*`, `Card/*` — shadows and glass blur | `--shadow-*`, `--glass-blur` |
| Paint styles — linear gradients of the card and phone frame | `--card-bg`, `--phone-*` |
| Page `Icons` — 64 components `icon/<name>` in 6 packs, color bound to `theme` `fg/default` | `src/icons/paths.js` |

Not converted, on purpose: easing curves (a prototype setting in Figma), the
radial `--bg-ambient` backdrop and card glows (drawn once on the frames that
use them). `ui-monospace` has no Figma equivalent and maps to Roboto Mono.
