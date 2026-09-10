import { Stack, Surface, Text, Divider, Icon } from '../ui/index.js'
import { Section, Spec, Cell } from './parts.jsx'

export function Primitives() {
  return (
    <>
      <Section title="Stack" hint="A direct twin of Figma Auto Layout and the only way to lay things out. Margin and grid are not allowed.">
        <Spec title="Direction and gap" contract="dir=row|column · gap from the 4-pt scale" column>
          <Stack dir="row" gap={8}>
            {[1, 2, 3].map((i) => <Box key={i} label="gap 8" />)}
          </Stack>
          <Stack dir="row" gap={24}>
            {[1, 2, 3].map((i) => <Box key={i} label="gap 24" />)}
          </Stack>
        </Spec>

        <Spec title="Sizing" contract="hug (default) · fill = flex: 1 1 0 · fillCross = align-self: stretch" column>
          <Stack dir="row" gap={8} fillCross>
            <Box label="hug" />
            <Stack fill><Box label="fill takes the rest" /></Stack>
            <Box label="hug" />
          </Stack>
        </Spec>

        <Spec title="Alignment" contract="align + justify = Figma's 9-point grid" column>
          <Stack dir="row" gap={8} justify="between" fillCross>
            <Box label="start" />
            <Box label="between" />
            <Box label="end" />
          </Stack>
        </Spec>
      </Section>

      <Section title="Text" hint="10 type styles × 8 tones. The only way to render text, so there are no bare spans with a font size.">
        <Spec title="Tones" column>
          {['default', 'dim', 'faint', 'accent', 'success', 'danger', 'warning'].map((tone) => (
            <Text key={tone} variant="body" tone={tone}>
              {tone}: Wallet balance $12,345.67
            </Text>
          ))}
        </Spec>

        <Spec title="Truncate and tabular numbers" contract="truncate → Figma: Truncate text · numeric → tabular figures" column>
          <Stack dir="row" gap={12} fillCross>
            <Text variant="mono" fill truncate>bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh: a long address truncates instead of breaking the row</Text>
          </Stack>
          <Stack gap={2}>
            <Text variant="title" numeric>1,234.50</Text>
            <Text variant="title" numeric>9,876.10</Text>
            <Text variant="bodySm" tone="dim">digits line up in columns (tabular-nums)</Text>
          </Stack>
        </Spec>
      </Section>

      <Section title="Surface" hint="The base card: 4 levels × 5 radii plus a glass variant (backdrop-filter).">
        <Spec title="Levels" contract="column · W=fill · H=hug · pad 16 · gap 12">
          {[0, 1, 2, 3].map((level) => (
            <Cell key={level} label={`level ${level}`} center>
              <Surface level={level} radius="lg" pad={16} style={{ width: 148 }}>
                <Text variant="label">Surface {level}</Text>
                <Text variant="caption" tone="dim">caption</Text>
              </Surface>
            </Cell>
          ))}
        </Spec>

        <Spec title="Glass" contract="backdrop-filter blur(20px)">
          <div style={{
            display: 'flex', gap: 'var(--space-16)', padding: 'var(--space-24)',
            borderRadius: 'var(--r-xl)',
            background: 'var(--card-bg)',
            boxShadow: '0 0 60px var(--card-glow)',
          }}>
            <Surface glass radius="lg" pad={16} style={{ width: 180 }}>
              <Stack dir="row" gap={8} align="center">
                <Icon name="contactless" size={20} tone="accent" />
                <Text variant="label">Liquid glass</Text>
              </Stack>
              <Text variant="caption" tone="dim">over a real card</Text>
            </Surface>
          </div>
        </Spec>
      </Section>

      <Section title="Divider" hint="row · W=fill · H=fixed(1)">
        <Spec title="Insets" column>
          <Divider inset={0} />
          <Text variant="bodySm" tone="dim">inset 0: full width</Text>
          <Divider inset={56} />
          <Text variant="bodySm" tone="dim">inset 56: starts after a 40px avatar + 16 gap</Text>
        </Spec>
      </Section>
    </>
  )
}

function Box({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 88, height: 48, padding: '0 var(--space-12)',
      borderRadius: 'var(--r-sm)',
      background: 'var(--accent-subtle)',
      boxShadow: 'inset 0 0 0 1px var(--accent-border)',
      color: 'var(--fg-accent)',
      fontSize: 'var(--text-caption-size)',
      fontFamily: 'var(--font-mono)',
      whiteSpace: 'nowrap',
    }}>{label}</div>
  )
}
