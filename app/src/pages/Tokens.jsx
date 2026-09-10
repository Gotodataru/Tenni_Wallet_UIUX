import { Stack, Text, Icon } from '../ui/index.js'
import { Section, Spec, Cell } from './parts.jsx'

const SURFACES = [
  ['--c-ball', 'Ball', 'brand accent · up'],
  ['--c-court', 'Hard court', 'light-theme accent · card'],
  ['--c-base', 'Night court', 'dark canvas'],
  ['--c-clay', 'Clay', 'down · errors'],
  ['--c-chalk', 'Chalk', 'text on dark'],
]

const SEMANTIC = [
  ['--bg-canvas', 'app background'],
  ['--bg-surface-1', 'card'],
  ['--bg-surface-2', 'card on a card'],
  ['--bg-surface-3', 'highlighted'],
  ['--accent', 'brand accent'],
  ['--accent-subtle', 'accent tint'],
  ['--success', 'up, success'],
  ['--danger', 'down, error'],
  ['--warning', 'warning'],
  ['--info', 'info'],
  ['--fg-default', 'primary text'],
  ['--fg-dim', 'secondary text'],
  ['--fg-faint', '⚠ decoration only'],
  ['--border-subtle', 'hairline'],
  ['--border-strong', 'visible border'],
]

const SPACES = [2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64]
const RADII = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']
const TYPE = [
  ['display', '40/44', 'Balance on Home'],
  ['h1', '32/36', 'Screen title'],
  ['h2', '24/28', 'Section title'],
  ['h3', '20/24', 'Subtitle'],
  ['title', '17/22', 'List row title'],
  ['body', '15/20', 'Body text'],
  ['bodySm', '13/18', 'Secondary text'],
  ['label', '13/16', 'Button and field label'],
  ['caption', '11/14', 'Tag, timestamp'],
  ['mono', '13/18', 'Wallet address, hash'],
]

function Swatch({ name, title, role }) {
  return (
    <div className="Swatch">
      <div className="Swatch__chip" style={{ background: `var(${name})` }} />
      <div className="Swatch__meta">
        {title && <Text variant="label">{title}</Text>}
        <span className="Swatch__name">{name}</span>
        <span className="Swatch__value">{role}</span>
      </div>
    </div>
  )
}

export function Tokens() {
  return (
    <Section
      hint="Three layers: primitives (palette) → semantics (theme, two modes) → scales. Components may only use the semantic layer."
    >
      <Spec title="Palette concept — three tennis surfaces" contract="Figma: Variables «palette»">
        {SURFACES.map(([name, title, role]) => <Swatch key={name} name={name} title={title} role={role} />)}
      </Spec>

      <Spec title="Semantic colors" contract="Figma: Variables «theme», modes Dark / Light">
        {SEMANTIC.map(([name, role]) => <Swatch key={name} name={name} role={role} />)}
      </Spec>

      <div className="Note">
        <Icon name="alert-triangle" size={20} tone="warning" />
        <Text variant="bodySm">
          <b>--fg-faint</b> is 3.7:1 on the dark canvas — below WCAG AA (4.5:1). It is
          allowed for decoration and text 24px and larger only. Secondary text uses
          <b> --fg-dim</b> (8.2:1). In the light theme the ball becomes olive and the
          accent switches to court blue: lime on paper is 1.2:1.
        </Text>
      </div>

      <Spec title="Spacing · 4-pt grid" contract="token name = value in px" column>
        {SPACES.map((s) => (
          <Stack key={s} dir="row" gap={12} align="center">
            <Text variant="mono" tone="dim" style={{ width: 96, flex: '0 0 auto' }}>--space-{s}</Text>
            <div className="SpaceBar" style={{ width: `${s}px` }} />
          </Stack>
        ))}
      </Spec>

      <Spec title="Radii">
        {RADII.map((r) => (
          <Cell key={r} label={`--r-${r}`} center>
            <div style={{
              width: 64, height: 64,
              background: 'var(--bg-surface-3)',
              boxShadow: 'inset 0 0 0 1px var(--border-strong)',
              borderRadius: `var(--r-${r})`,
            }} />
          </Cell>
        ))}
      </Spec>

      <Spec title="Type scale" contract="line-height in px only — unitless values don't transfer to Figma" column>
        {TYPE.map(([variant, metrics, role]) => (
          <Stack key={variant} dir="row" gap={20} align="baseline">
            <Text variant="mono" tone="accent" style={{ width: 84, flex: '0 0 auto' }}>{variant}</Text>
            <Text variant="mono" tone="faint" style={{ width: 56, flex: '0 0 auto' }}>{metrics}</Text>
            <Text variant={variant} fill truncate>{role}</Text>
          </Stack>
        ))}
      </Spec>

      <Spec title="Shadows">
        {[0, 1, 2, 3, 4].map((l) => (
          <Cell key={l} label={`--shadow-${l}`} center>
            <div style={{
              width: 80, height: 56,
              background: 'var(--bg-surface-2)',
              borderRadius: 'var(--r-md)',
              boxShadow: `var(--shadow-${l})`,
            }} />
          </Cell>
        ))}
      </Spec>
    </Section>
  )
}
