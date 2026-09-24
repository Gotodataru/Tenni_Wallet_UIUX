# Tenni Wallet

A concept crypto wallet with a debit card: UX case study, clickable prototype
and a coded design system.

**Live:** [gotodataru.github.io/Tenni_Wallet_UIUX](https://gotodataru.github.io/Tenni_Wallet_UIUX/).
The case study, the prototype, every screen in every state and the design system in one place.
Landing page: [/landing](https://gotodataru.github.io/Tenni_Wallet_UIUX/landing/).

**Figma:** [design system and 20 screens](https://www.figma.com/design/0ZzLBKXtXVnVgLirNT7KtM/Tenni-Wallet-Design-System)
· [prototype](https://www.figma.com/proto/0ZzLBKXtXVnVgLirNT7KtM/Tenni-Wallet-Design-System?node-id=20-3577&starting-point-node-id=20%3A3577).
Variables, components on Auto Layout, screens assembled from component instances.

**Usability test:** [protocol with thresholds set in advance](research/README.md).
The participant link is [#test](https://gotodataru.github.io/Tenni_Wallet_UIUX/#test):
the prototype alone, full screen on a phone.

---

## The product

People who keep their money in crypto still spend it in the real world. Tenni
lets them tap a card at any terminal and pay from their crypto balance, and send
or receive without the mistakes that lose money.

Key decisions:

- **The terminal sets the amount, not the user.** Pay starts with the merchant's
  request (amount in local currency and its dollar value); the only choice is
  which asset to pay with. The conversion fee is included in what gets charged.
- **Every money-losing mistake has a guard.** The address field catches typos
  and wrong-network addresses; review shows the full address grouped by four
  characters; Max leaves room for the network fee.
- **Color means something, and never alone.** The tennis-ball palette: the lime
  ball (accent, up), grass and moss greens (surfaces), clay (down, errors).
  Spending stays neutral; every change carries an ▲/▼ arrow.
- **States, not just happy paths.** Loading, empty, error, declined, pending,
  failed, not enough funds.

## What's inside

- **7 screens** wired into one clickable prototype: Onboarding, Home, Pay,
  Send, Receive, Activity, Settings + Profile
- **44 components**, from primitives (`Text`, `Stack`, `Surface`) to product
  blocks (`ListRow`, `CardVisual`, `LockOverlay`); screens are assembled from
  them with no screen-level CSS
- **71 icons** in 6 packs on one geometry (24×24 viewBox, 2 stroke): 68 line icons (with four spending categories) plus filled twins of three tab icons
- **Tokens**: palette, semantic layer with Dark/Light modes, 4-pt spacing,
  type scale with px line heights, radii, shadows, motion
- **Landing page** (`landing/`), static, no build step

## Built for Figma handoff

Components use only the subset of CSS that maps one-to-one to Figma Auto Layout:
no `margin` (only `gap`/`padding`), no percentage sizes, no `grid`. It isn't a
style preference: `npm run check:figma` fails the build on any violation.
Details: [`docs/FIGMA_RULES.md`](docs/FIGMA_RULES.md); every component's sizing
contract: [`docs/COMPONENTS.md`](docs/COMPONENTS.md).

## Run locally

```bash
cd app
npm install
npm run dev        # catalog + prototype
npm run build      # figma-rules linter + production build
```

## Stack

Vite · React 19 · plain CSS with tokens (no Tailwind, no CSS-in-JS).

## Repository

```
app/      React app: design system, catalog, screens, prototype
landing/  static landing page
brand/    logo
docs/     layout rules and the component registry
```
