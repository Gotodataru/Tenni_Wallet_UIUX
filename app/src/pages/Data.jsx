import { useState } from 'react'
import {
  Avatar, AssetIcon, Amount, Balance, Skeleton,
  Sparkline, Donut, ProgressDots, QRBlock, ListRow, TransactionRow, CardVisual,
  Stack, Text, Button, Icon, Toggle, Checkbox, Surface, IconButton,
} from '../ui/index.js'
import { Section, Spec, Cell } from './parts.jsx'

const AVATAR_SIZES = [28, 36, 40, 48, 56]

function AvatarSection() {
  return (
    <Section title="Avatar" hint="W=fixed(size) H=fixed(size) · radius full. Types: image / initials / icon / asset.">
      <Spec title="Sizes">
        {AVATAR_SIZES.map((s) => (
          <Cell key={s} label={`${s}px`} center><Avatar size={s} type="initials" initials="LP" /></Cell>
        ))}
      </Spec>

      <Spec title="Types">
        <Cell label="initials" center><Avatar type="initials" initials="NR" /></Cell>
        <Cell label="icon" center><Avatar type="icon" icon="user" /></Cell>
        <Cell label="asset" center><Avatar type="asset" icon="stake" /></Cell>
        <Cell label="ring" center><Avatar type="initials" initials="NR" ring /></Cell>
        <Cell label="badge (online)" center><Avatar type="initials" initials="NR" badge /></Cell>
      </Spec>
    </Section>
  )
}

const ASSET_SYMBOLS = ['btc', 'eth', 'usdt', 'sol', 'bnb', 'xyz']

function AssetIconSection() {
  return (
    <Section title="AssetIcon" hint="W=fixed(size) H=fixed(size). Known symbols get their brand color, unknown ones fall back to a monogram.">
      <Spec title="Symbols">
        {ASSET_SYMBOLS.map((s) => (
          <Cell key={s} label={s} center><AssetIcon symbol={s} size={40} /></Cell>
        ))}
      </Spec>
      <Spec title="chain badge">
        <Cell label="with a network badge" center><AssetIcon symbol="usdt" size={40} chainBadge chainIcon="eth" /></Cell>
      </Spec>
    </Section>
  )
}

function AmountSection() {
  return (
    <Section title="Amount" hint="row · W=hug H=hug · gap 4. Up and down are never color alone: showArrow adds ▲/▼.">
      <Spec title="Tones + arrow" column>
        <Amount value={1240.5} sign="plus" showArrow size="lg" />
        <Amount value={-84.2} sign="minus" showArrow size="lg" />
        <Amount value={0} tone="neutral" size="lg" />
      </Spec>
      <Spec title="Sizes">
        {['sm', 'md', 'lg', 'xl'].map((size) => (
          <Cell key={size} label={size} center><Amount value={12345.67} sign="plus" showArrow size={size} /></Cell>
        ))}
      </Spec>
      <Spec title="masked (hidden balance)">
        <Cell label="visible" center><Amount value={999.99} sign="plus" showArrow /></Cell>
        <Cell label="masked" center><Amount value={999.99} sign="plus" showArrow masked /></Cell>
      </Spec>
    </Section>
  )
}

function BalanceSection() {
  const [masked, setMasked] = useState(false)
  return (
    <Section title="Balance" hint="column · W=hug H=hug · gap 6 · center. Composed of Text + IconButton + Amount + Chip.">
      <Spec title="Live example" column>
        <Balance value={12345.67} masked={masked} onToggleMask={setMasked} delta={3.84} period="7 days" />
      </Spec>
      <Spec title="States">
        <Cell label="default" center><Balance value={890.1} delta={-1.2} period="24h" /></Cell>
        <Cell label="loading" center><Balance value={0} loading /></Cell>
        <Cell label="align=start (Home header)" center><Balance align="start" value={12345.67} delta={3.84} period="7 days" /></Cell>
        <Cell label="align=start · loading" center><Balance align="start" value={0} loading /></Cell>
      </Spec>
    </Section>
  )
}

function SkeletonSection() {
  return (
    <Section title="Skeleton" hint="Used INSIDE other components while loading (see Balance, Sparkline, QRBlock), not instead of them.">
      <Spec title="Shapes" column>
        <Skeleton shape="line" w={240} h={16} />
        <Stack dir="row" gap={12} align="center">
          <Skeleton shape="circle" w={40} h={40} />
          <Stack gap={6} fill>
            <Skeleton shape="line" w={160} h={14} />
            <Skeleton shape="line" w={100} h={12} />
          </Stack>
        </Stack>
        <Skeleton shape="rect" h={64} />
      </Spec>
    </Section>
  )
}

function makeWalk(n, seedStart, volatility) {
  let v = seedStart
  const out = [v]
  for (let i = 1; i < n; i++) {
    v = v * (1 + (Math.sin(i * 1.7) * volatility))
    out.push(v)
  }
  return out
}

const UP_DATA = makeWalk(14, 1000, 0.06)
const DOWN_DATA = makeWalk(14, 1000, -0.05)
const FLAT_DATA = Array.from({ length: 14 }, () => 1000)   // range === 0 — guards against NaN

function SparklineSection() {
  return (
    <Section title="Sparkline" hint="W=fill H=fixed(64). A flat series (range === 0) draws a centered line instead of breaking into NaN.">
      <Spec title="Tones" column>
        <Sparkline data={UP_DATA} tone="up" showFill showDots />
        <Sparkline data={DOWN_DATA} tone="down" showFill showDots />
      </Spec>
      <Spec title="range === 0, regression case" column>
        <Sparkline data={FLAT_DATA} tone="neutral" showDots />
        <Text variant="caption" tone="faint">all 14 values are 1000</Text>
      </Spec>
      <Spec title="States" column>
        <Sparkline state="loading" />
        <Sparkline state="empty" />
      </Spec>
    </Section>
  )
}

const PORTFOLIO = [
  { value: 66, color: 'var(--c-eth)', label: 'ETH' },
  { value: 24, color: 'var(--c-btc)', label: 'BTC' },
  { value: 10, color: 'var(--c-usdt)', label: 'USDT' },
]

function DonutSection() {
  return (
    <Section title="Donut" hint="W=fixed(160) H=fixed(160). Segments via stroke-dasharray, starting at the top (rotate −90).">
      <Spec title="Live example: portfolio allocation">
        <Donut segments={PORTFOLIO} showCenter centerValue="3" centerLabel="assets" thickness={16} />
        <Stack gap={8}>
          {PORTFOLIO.map((s) => (
            <Stack key={s.label} dir="row" gap={8} align="center">
              <div style={{ width: 10, height: 10, borderRadius: 'var(--r-full)', background: s.color, flex: '0 0 auto' }} />
              <Text variant="bodySm">{s.label} {s.value}%</Text>
            </Stack>
          ))}
        </Stack>
      </Spec>
      <Spec title="thickness">
        <Cell label="12" center><Donut segments={PORTFOLIO} thickness={12} /></Cell>
        <Cell label="16" center><Donut segments={PORTFOLIO} thickness={16} /></Cell>
      </Spec>
    </Section>
  )
}

function ProgressDotsSection() {
  const [step, setStep] = useState(0)
  return (
    <Section title="ProgressDots" hint="row · W=hug H=fixed(8) · gap 6. Step indicator for multi-step flows.">
      <Spec title="Live example" column>
        <ProgressDots total={3} active={step} />
        <Stack dir="row" gap={8}>
          <Button size="sm" variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
          <Button size="sm" variant="primary" onClick={() => setStep((s) => Math.min(2, s + 1))}>Next</Button>
        </Stack>
      </Spec>
      <Spec title="total">
        <Cell label="3 steps" center><ProgressDots total={3} active={1} /></Cell>
        <Cell label="5 steps" center><ProgressDots total={5} active={3} /></Cell>
      </Spec>
    </Section>
  )
}

function QRBlockSection() {
  return (
    <Section title="QRBlock" hint="column · W=hug H=hug · pad 20 · gap 16 · center. ⚠ A deterministic decorative pattern, not a scannable QR. A real encoder plugs in at integration.">
      <Spec title="Sizes">
        <Cell label="200" center><QRBlock value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" size={200} /></Cell>
        <Cell label="240 + logo slot" center><QRBlock value="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" size={240} withLogo logo={<AssetIcon symbol="btc" size={32} />} /></Cell>
      </Spec>
      <Spec title="States">
        <Cell label="loading" center><QRBlock size={200} state="loading" /></Cell>
        <Cell label="expired" center><QRBlock value="bc1qxy2..." size={200} state="expired" /></Cell>
      </Spec>
    </Section>
  )
}

function ListRowSection() {
  const [selected, setSelected] = useState('eth')

  return (
    <Section
      title="ListRow"
      hint="row · W=fill H=fixed(68|56) · pad 0/16 · gap 12. The most reused component after Button: Activity, Settings, Profile, Send, Receive and Pay are built on it."
    >
      <Spec title="Slots instead of a list of types" contract="leading / trailing: ReactNode = Instance swap in Figma" column>
        <Text variant="bodySm" tone="dim">
          The first spec said <code>leading (avatar|asset|icon|none)</code>. It is built with slots
          instead: in Figma a slot is exactly an Instance swap property. An enum would force ListRow
          to know the props of Avatar, AssetIcon and Checkbox and pass them all through, and Figma has
          no equivalent for that.
        </Text>
      </Spec>

      <Spec title="leading: different slots" contract="hug, size comes from the nested component" column>
        <Surface level={1} pad={0} gap={0}>
          <ListRow leading={<Avatar type="initials" initials="LP" />} title="Leo Park" subtitle="Transfer to a contact" trailing={<Amount value={1200} sign="minus" tone="neutral" size="sm" />} divider />
          <ListRow leading={<AssetIcon symbol="btc" size={40} />} title="Bitcoin" subtitle="0.0485 BTC" trailing={<Amount value={2968.2} sign="plus" showArrow size="sm" />} meta="+2.4%" divider />
          <ListRow leading={<Avatar type="icon" icon="pay" />} title="Starbucks" subtitle="Today · 09:12 · ••4291" trailing={<Amount value={4.8} sign="minus" tone="neutral" size="sm" />} divider />
          <ListRow leading={<Checkbox defaultChecked aria-label="Select" />} title="Pick from a list" subtitle="leading can be a control" />
        </Surface>
      </Spec>

      <Spec title="trailing: different slots" contract="hug · column · align end · gap 2" column>
        <Surface level={1} pad={0} gap={0}>
          <ListRow leading={<AssetIcon symbol="eth" size={40} />} title="Amount" subtitle="An amount with an arrow" trailing={<Amount value={890.5} sign="plus" showArrow size="sm" />} meta="24h" divider />
          <ListRow size="sm" leading={<Avatar type="icon" icon="face-id" />} title="Toggle" trailing={<Toggle defaultChecked aria-label="Face ID" />} divider />
          <ListRow size="sm" leading={<Avatar type="icon" icon="globe" />} title="Text" trailing={<Text variant="bodySm" tone="dim">English</Text>} chevron divider />
          <ListRow size="sm" leading={<Avatar type="icon" icon="shield" />} title="Chevron only" chevron divider />
          <ListRow size="sm" leading={<Avatar type="icon" icon="info" />} title="No trailing" />
        </Surface>
      </Spec>

      <Spec title="min-width: 0 matters" contract="without it a long address pushes trailing off screen" column>
        <Surface level={1} pad={0} gap={0}>
          <ListRow
            leading={<AssetIcon symbol="btc" size={40} />}
            title="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
            subtitle="A very long name that has to truncate instead of breaking the row layout"
            trailing={<Amount value={12000} sign="plus" size="sm" />}
          />
        </Surface>
        <Text variant="caption" tone="faint">
          title and subtitle end in an ellipsis and trailing stays put. That is min-width: 0 on the body
        </Text>
      </Spec>

      <Spec title="States" contract="shown statically, the future Figma Component Set" column>
        <Surface level={1} pad={0} gap={0}>
          <ListRow leading={<Avatar type="icon" icon="user" />} title="default" subtitle="regular row" chevron divider />
          <ListRow leading={<Avatar type="icon" icon="user" />} title="pressed" subtitle="being tapped" state="pressed" chevron divider />
          <ListRow leading={<Avatar type="icon" icon="user" />} title="selected" subtitle="chosen" state="selected" chevron divider />
          <ListRow leading={<Avatar type="icon" icon="user" />} title="disabled" subtitle="unavailable" state="disabled" chevron />
        </Surface>
      </Spec>

      <Spec title="state=swiped" contract="the gesture doesn't transfer to Figma, the open state does" column>
        <Surface level={1} pad={0} gap={0}>
          <ListRow
            leading={<AssetIcon symbol="usdt" size={40} />}
            title="Swipe open"
            subtitle="the action sits under the row"
            state="swiped"
            swipeAction={<IconButton variant="ghost" icon="trash" aria-label="Delete" />}
          />
        </Surface>
      </Spec>

      <Spec title="Live example: choosing a network" column>
        <Surface level={1} pad={0} gap={0}>
          {[
            ['eth', 'Ethereum', 'ERC-20 · fee ~$2.10'],
            ['sol', 'Solana', 'SPL · fee ~$0.01'],
            ['bnb', 'BNB Chain', 'BEP-20 · fee ~$0.20'],
          ].map(([id, title, subtitle], i, arr) => (
            <ListRow
              key={id}
              leading={<AssetIcon symbol={id} size={40} />}
              title={title}
              subtitle={subtitle}
              state={selected === id ? 'selected' : undefined}
              trailing={selected === id ? <Icon name="check" size={20} tone="accent" /> : undefined}
              divider={i < arr.length - 1}
              onClick={() => setSelected(id)}
            />
          ))}
        </Surface>
      </Spec>
    </Section>
  )
}

function TransactionRowSection() {
  return (
    <Section
      title="TransactionRow"
      hint="A preset of ListRow, not a copy of its markup. Leading is a circle by transaction type, trailing is Amount. Spending stays neutral; only incoming money is colored."
    >
      <Spec title="5 types, icon, tone and sign set automatically" column>
        <Surface level={1} pad={0} gap={0}>
          <TransactionRow type="sent" title="Sent to Leo" subtitle="Today · 10:30" value={0.005} currency="" unit="BTC" precision={3} divider />
          <TransactionRow type="received" title="From exchange" subtitle="Yesterday · 18:45" value={0.002} currency="" unit="ETH" precision={3} divider />
          <TransactionRow type="paid" title="Starbucks" subtitle="Today · 09:12 · ••4291" value={4.8} divider />
          <TransactionRow type="swapped" title="ETH → USDT" subtitle="2 days ago" value={412.5} divider />
          <TransactionRow type="staked" title="Staked SOL" subtitle="3 days ago" value={120} currency="" unit="SOL" precision={2} />
        </Surface>
      </Spec>

      <Spec title="Data states: pending / failed" contract="override icon, tone and the caption under the amount without touching the ListRow layout" column>
        <Surface level={1} pad={0} gap={0}>
          <TransactionRow type="sent" title="Sent to Sam" subtitle="Just now" value={250} state="pending" divider />
          <TransactionRow type="sent" title="Sent to exchange" subtitle="5 minutes ago" value={99.9} state="failed" />
        </Surface>
      </Spec>

      <Spec title="Precision: crypto is not rounded to 2 decimals" column>
        <Text variant="bodySm" tone="dim">
          Amount has a <code>precision</code> prop: with 2 decimals 0.005 BTC would round to
          0.01, almost double. The same value with precision 2 (wrong for crypto) and 5 (right):
        </Text>
        <Stack dir="row" gap={24}>
          <Cell label="precision=2 (cash)" center><Amount value={0.005} currency="" suffix=" BTC" precision={2} sign="minus" tone="neutral" /></Cell>
          <Cell label="precision=5 (crypto)" center><Amount value={0.005} currency="" suffix=" BTC" precision={5} sign="minus" tone="neutral" /></Cell>
        </Stack>
      </Spec>
    </Section>
  )
}

function CardVisualSection() {
  const [masked, setMasked] = useState(true)

  return (
    <Section
      title="CardVisual"
      hint="column · W=fill H=fixed(224) · pad 20 · space-between. 224 at 358 wide is the ISO card ratio 1.586. The hero visual of the product."
    >
      <Spec title="What the component does NOT include" column>
        <Text variant="bodySm" tone="dim">
          The "Pay with ETH" row under the card on Home is not part of the card. It is a payment
          composer assembled on the screen from ListRow + AssetIcon + Button: the card is plastic,
          the row is the app. Keeping them apart also keeps the Pay button out of the picture, so it
          can't be read as decoration.
        </Text>
      </Spec>

      <Spec title="skin" contract="ball is the brand card · auto follows the theme · dark/light are fixed plastic" column>
        <CardVisual skin="ball" />
        <Stack dir="row" gap={16} fillCross>
          <Stack fill><CardVisual skin="dark" kind="debit" /></Stack>
          <Stack fill><CardVisual skin="light" kind="credit" last4="8814" /></Stack>
        </Stack>
      </Spec>

      <Spec title="masked" column>
        <CardVisual skin="ball" masked={masked} />
        <Button variant="secondary" size="sm" iconLeading={masked ? 'eye' : 'eye-off'} onClick={() => setMasked((v) => !v)}>
          {masked ? 'Show number' : 'Hide number'}
        </Button>
      </Spec>

      <Spec title="States" column>
        <Stack dir="row" gap={16} fillCross>
          <Stack fill><CardVisual skin="ball" state="frozen" /></Stack>
          <Stack fill><CardVisual skin="ball" state="expired" /></Stack>
        </Stack>
      </Spec>

      <Spec title="Card + Pay with" contract="column · gap 8: the card, then a ListRow on Surface l1" column>
        <div style={{ width: 358, maxWidth: '100%' }}>
          <Stack gap={8}>
            <CardVisual skin="ball" kind="debit" holder="" />
            <Surface level={1} radius="lg" pad={0} gap={0}>
              <ListRow
                leading={<AssetIcon symbol="eth" size={40} />}
                title="Pay with ETH"
                subtitle="2.04 ETH · ≈ $8,128"
                trailing={<Button variant="primary" size="sm" iconLeading="pay">Pay</Button>}
              />
            </Surface>
          </Stack>
        </div>
        <Text variant="caption" tone="faint">
          Assembled entirely from system components, no new CSS
        </Text>
      </Spec>
    </Section>
  )
}

export function Data() {
  return (
    <>
      <ListRowSection />
      <TransactionRowSection />
      <CardVisualSection />
      <AvatarSection />
      <AssetIconSection />
      <AmountSection />
      <BalanceSection />
      <SkeletonSection />
      <SparklineSection />
      <DonutSection />
      <ProgressDotsSection />
      <QRBlockSection />
    </>
  )
}
