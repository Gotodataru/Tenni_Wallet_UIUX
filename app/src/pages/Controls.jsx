import { useState } from 'react'
import {
  Button, IconButton, Input, Toggle,
  Checkbox, Radio, Segmented, Chip, Badge, Keypad, Slider,
  Stack, Text,
} from '../ui/index.js'
import { typeKey, backspace } from '../screens/format.js'
import { Section, Spec, Cell } from './parts.jsx'

const VARIANTS = [
  ['primary',   'The main action of a screen. Exactly one.'],
  ['secondary', 'The alternative next to primary.'],
  ['ghost',     'Tertiary, inside dense blocks.'],
  ['outline',   'An action on a colored surface or a card.'],
  ['danger',    'Irreversible: unlink a card, delete a wallet.'],
  ['success',   'Confirmation inside a success state.'],
  ['link',      'Inline in text.'],
]

const SIZES = ['sm', 'md', 'lg', 'xl']
const STATES = ['default', 'hover', 'pressed', 'focus', 'disabled', 'loading']

export function Controls() {
  return (
    <>
      <Section
        title="Button"
        hint="7 variants × 4 sizes × 6 states. In Figma this is one Component Set with variant / size / state properties, not 168 separate components."
      >
        <Spec title="Variants and when to use them" contract="row · W=hug · H=fixed · pad 0/16 · gap 8" column>
          {VARIANTS.map(([variant, why]) => (
            <Stack key={variant} dir="row" gap={16} align="center">
              <div style={{ width: 110, flex: '0 0 auto' }}>
                <Button variant={variant} size="md">Button</Button>
              </div>
              <Stack gap={2} fill>
                <Text variant="mono" tone="accent">{variant}</Text>
                <Text variant="bodySm" tone="dim">{why}</Text>
              </Stack>
            </Stack>
          ))}
        </Spec>

        <Spec title="Sizes" contract="sm 32 · md 40 · lg 48 · xl 56, set by height, not padding">
          {SIZES.map((size) => (
            <Cell key={size} label={size} center>
              <Button variant="primary" size={size}>Send</Button>
            </Cell>
          ))}
        </Spec>

        <Spec title="States" contract="shown statically, this becomes the Figma Component Set">
          {STATES.map((state) => (
            <Cell key={state} label={state} center>
              <Button variant="primary" size="md" state={state === 'default' ? undefined : state}>
                Confirm
              </Button>
            </Cell>
          ))}
        </Spec>

        <Spec title="States · secondary">
          {STATES.map((state) => (
            <Cell key={state} label={state} center>
              <Button variant="secondary" size="md" state={state === 'default' ? undefined : state}>
                Receive
              </Button>
            </Cell>
          ))}
        </Spec>

        <Spec title="States · outline">
          {STATES.map((state) => (
            <Cell key={state} label={state} center>
              <Button variant="outline" size="md" state={state === 'default' ? undefined : state}>
                Top up
              </Button>
            </Cell>
          ))}
        </Spec>

        <Spec title="States · danger">
          {STATES.map((state) => (
            <Cell key={state} label={state} center>
              <Button variant="danger" size="md" state={state === 'default' ? undefined : state}>
                Unlink
              </Button>
            </Cell>
          ))}
        </Spec>

        <Spec title="Icons" contract="iconLeading / iconTrailing / iconOnly · gap 8 · icon flex: 0 0 auto">
          <Cell label="leading" center><Button iconLeading="send">Send</Button></Cell>
          <Cell label="trailing" center><Button variant="secondary" iconTrailing="chevron-right">See all</Button></Cell>
          <Cell label="both" center><Button variant="outline" iconLeading="swap" iconTrailing="chevron-down">Swap</Button></Cell>
          <Cell label="iconOnly sm" center><Button variant="ghost" size="sm" iconOnly iconLeading="more" aria-label="More" /></Cell>
          <Cell label="iconOnly md" center><Button variant="secondary" size="md" iconOnly iconLeading="qr" aria-label="QR" /></Cell>
          <Cell label="iconOnly lg" center><Button variant="primary" size="lg" iconOnly iconLeading="plus" aria-label="Add" /></Cell>
        </Spec>

        <Spec title="fullWidth" contract="Hug → Fill container. A separate modifier, NOT width: 100%" column>
          <Button variant="primary" size="xl" fullWidth iconLeading="pay">Pay $1,240.50</Button>
          <Stack dir="row" gap={12} fillCross>
            <Button variant="secondary" size="lg" fullWidth iconLeading="receive">Receive</Button>
            <Button variant="primary" size="lg" fullWidth iconLeading="send">Send</Button>
          </Stack>
        </Spec>
      </Section>

      <IconButtonSection />
      <InputSection />
      <ToggleSection />
      <CheckRadioSection />
      <SegmentedSection />
      <ChipSection />
      <BadgeSection />
      <KeypadSection />
      <SliderSection />
    </>
  )
}

const IB_VARIANTS = [
  ['ghost',   'In bars and toolbars, on top of content.'],
  ['solid',   'A standalone button outside a container (FAB-like).'],
  ['outline', 'On a colored surface or a card.'],
]
const IB_SIZES = [32, 40, 48]
const IB_STATES = ['default', 'hover', 'pressed', 'focus', 'disabled', 'loading']

function IconButtonSection() {
  return (
    <Section
      title="IconButton"
      hint="3 variants × 3 sizes × 6 states + badge. The touch target is at least 44×44 even at size 32, extended with a pseudo-element."
    >
      <Spec title="Variants and when to use them" contract="row · W=fixed(size) H=fixed(size) · pad 0 · center" column>
        {IB_VARIANTS.map(([variant, why]) => (
          <Stack key={variant} dir="row" gap={16} align="center">
            <div style={{ width: 48, flex: '0 0 auto', display: 'flex' }}>
              <IconButton variant={variant} icon="settings" aria-label={variant} />
            </div>
            <Stack gap={2} fill>
              <Text variant="mono" tone="accent">{variant}</Text>
              <Text variant="bodySm" tone="dim">{why}</Text>
            </Stack>
          </Stack>
        ))}
      </Spec>

      <Spec title="Sizes" contract="32 · 40 · 48, icon inside 16 / 20 / 24">
        {IB_SIZES.map((size) => (
          <Cell key={size} label={`${size}px`} center>
            <IconButton variant="solid" size={size} icon="send" aria-label="Send" />
          </Cell>
        ))}
      </Spec>

      <Spec title="States · solid" contract="shown statically, becomes the Figma Component Set">
        {IB_STATES.map((state) => (
          <Cell key={state} label={state} center>
            <IconButton variant="solid" icon="bell" state={state === 'default' ? undefined : state} aria-label="Notifications" />
          </Cell>
        ))}
      </Spec>

      <Spec title="States · ghost">
        {IB_STATES.map((state) => (
          <Cell key={state} label={state} center>
            <IconButton variant="ghost" icon="more" state={state === 'default' ? undefined : state} aria-label="More" />
          </Cell>
        ))}
      </Spec>

      <Spec title="Badge" contract="the one legal absolute element outside the touch target">
        <Cell label="no badge" center><IconButton variant="solid" icon="bell" aria-label="Notifications" /></Cell>
        <Cell label="badge" center><IconButton variant="solid" icon="bell" badge aria-label="New notifications" /></Cell>
      </Spec>
    </Section>
  )
}

const INPUT_TYPES = [
  ['text', 'Recipient name', 'Leo Park'],
  ['amount', 'Amount', '1,240.50'],
  ['card', 'Card number', '4242 4242 4242 4242'],
  ['expiry', 'Expiry date', '12/28'],
  ['cvc', 'CVC', '123'],
  ['address', 'Wallet address', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'],
]
const INPUT_STATES = ['default', 'focus', 'filled', 'error', 'success', 'disabled', 'readonly']

function InputSection() {
  const [live, setLive] = useState('')

  return (
    <Section
      title="Input"
      hint="8 types × 7 states. Masks (card / expiry / cvc / amount) are pure functions in inputMasks.js, applied live while typing."
    >
      <Spec title="Types and masks" contract="column · W=fill H=hug · gap 6 · field H=fixed(48) · pad 0/16 · gap 8" column>
        {INPUT_TYPES.map(([type, label, placeholder]) => (
          <Input key={type} type={type} label={label} placeholder={placeholder} defaultValue={type === 'address' ? placeholder : ''} />
        ))}
      </Spec>

      <Spec title="Live example: amount mask" contract="digits → comma thousands, dot decimal" column>
        <Input
          type="amount"
          label="Transfer amount"
          placeholder="0"
          value={live}
          onChange={setLive}
          iconTrailing="close"
        />
        <Text variant="caption" tone="faint">raw value in state: “{live}”</Text>
      </Spec>

      <Spec title="Action slot" contract="action: an interactive trailing control (Instance swap)" column>
        <Input type="address" label="Recipient address" placeholder="bc1q…" action={<Button variant="ghost" size="sm">Paste</Button>} />
      </Spec>

      <Spec title="States" contract="all 7 at once, the future Figma Component Set" column>
        {INPUT_STATES.map((state) => (
          <Input
            key={state}
            type="text"
            label={state}
            placeholder="Field value"
            defaultValue={state === 'filled' ? 'Filled value' : ''}
            state={state === 'default' ? undefined : state}
            error={state === 'error' ? 'Check this value' : undefined}
            hint={state === 'default' ? 'Hint under the field' : undefined}
            iconLeading="search"
          />
        ))}
      </Spec>
    </Section>
  )
}

const TOGGLE_STATES = ['off', 'on', 'disabled-off', 'disabled-on', 'focus']

function ToggleSection() {
  const [live, setLive] = useState(true)

  return (
    <Section
      title="Toggle"
      hint="5 states. Track and thumb are Auto Layout with padding 4; the thumb moves with a transform (in Figma: two variants with different alignment)."
    >
      <Spec title="States" contract="row · W=fixed(52) H=fixed(32) · pad 4 · thumb fixed(24)">
        {TOGGLE_STATES.map((state) => (
          <Cell key={state} label={state} center>
            <Toggle
              defaultChecked={state === 'on' || state === 'disabled-on'}
              disabled={state.startsWith('disabled')}
              state={state === 'focus' ? 'focus' : undefined}
              aria-label={state}
            />
          </Cell>
        ))}
      </Spec>

      <Spec title="Live example" column>
        <Stack dir="row" gap={12} align="center">
          <Toggle checked={live} onChange={setLive} aria-label="Face ID" />
          <Stack gap={2}>
            <Text variant="body">Face ID</Text>
            <Text variant="bodySm" tone="dim">Unlock with a glance, currently {live ? 'on' : 'off'}</Text>
          </Stack>
        </Stack>
      </Spec>
    </Section>
  )
}

const CR_STATES = ['unchecked', 'checked', 'indeterminate', 'disabled', 'error']
const RADIO_STATES = ['unchecked', 'checked', 'disabled', 'error']

function CheckRadioSection() {
  const [group, setGroup] = useState('card')

  return (
    <Section title="Checkbox / Radio" hint="W=fixed(22) H=fixed(22). The control only. The label next to it is composed with Stack, same as Toggle.">
      <Spec title="Checkbox · states">
        {CR_STATES.map((state) => (
          <Cell key={state} label={state} center>
            <Checkbox
              defaultChecked={state === 'checked'}
              indeterminate={state === 'indeterminate'}
              disabled={state === 'disabled'}
              state={state === 'error' ? 'error' : undefined}
              aria-label={state}
            />
          </Cell>
        ))}
      </Spec>

      <Spec title="Radio · states">
        {RADIO_STATES.map((state) => (
          <Cell key={state} label={state} center>
            <Radio
              defaultChecked={state === 'checked'}
              disabled={state === 'disabled'}
              state={state === 'error' ? 'error' : undefined}
              aria-label={state}
            />
          </Cell>
        ))}
      </Spec>

      <Spec title="Live example: payment method" contract="Radio group with labels via Stack" column>
        {[
          ['card', 'Card', 'Debit •••• 4242'],
          ['crypto', 'Crypto', 'USDT (TRC-20)'],
        ].map(([value, title, sub]) => (
          <Stack key={value} dir="row" gap={12} align="center" as="label" style={{ cursor: 'pointer' }}>
            <Radio checked={group === value} onChange={() => setGroup(value)} aria-label={title} />
            <Stack gap={2}>
              <Text variant="body">{title}</Text>
              <Text variant="bodySm" tone="dim">{sub}</Text>
            </Stack>
          </Stack>
        ))}
      </Spec>
    </Section>
  )
}

function SegmentedSection() {
  const [tab, setTab] = useState(0)

  return (
    <Section title="Segmented" hint="row · W=fill H=fixed(40) · pad 4 · gap 2. Equal-width segments, flex: 1 1 0.">
      <Spec title="Live example" column>
        <Segmented items={['Crypto', 'Cash', 'NFT']} active={tab} onChange={setTab} />
        <Text variant="bodySm" tone="dim">selected segment: {tab}</Text>
      </Spec>

      <Spec title="2 / 3 / 4 segments" column>
        <Segmented items={['Day', 'Week']} active={0} onChange={() => {}} />
        <Segmented items={['1H', '1D', '1W']} active={1} onChange={() => {}} />
        <Segmented items={['24h', '7d', '30d', '1Y']} active={2} onChange={() => {}} />
      </Spec>

      <Spec title="disabled">
        <Cell label="disabled" center>
          <div style={{ width: 240 }}>
            <Segmented items={['Crypto', 'Cash']} active={0} disabled onChange={() => {}} />
          </div>
        </Cell>
      </Spec>
    </Section>
  )
}

const CHIP_VARIANTS = [
  ['neutral', 'Neutral filter'],
  ['accent',  'Active choice'],
  ['success', 'Status: completed'],
  ['danger',  'Status: failed'],
  ['warning', 'Status: pending'],
  ['outline', 'On a colored surface'],
]

function ChipSection() {
  return (
    <Section title="Chip" hint="row · W=hug H=fixed(32|24) · pad 0/12 · gap 6.">
      <Spec title="Variants and when to use them" column>
        {CHIP_VARIANTS.map(([variant, why]) => (
          <Stack key={variant} dir="row" gap={16} align="center">
            <div style={{ width: 110, flex: '0 0 auto' }}>
              <Chip variant={variant}>Chip</Chip>
            </div>
            <Text variant="bodySm" tone="dim">{why}</Text>
          </Stack>
        ))}
      </Spec>

      <Spec title="Sizes, icon, selected, removable">
        <Cell label="sm" center><Chip size="sm" variant="neutral">BTC</Chip></Cell>
        <Cell label="md" center><Chip size="md" variant="neutral">BTC</Chip></Cell>
        <Cell label="icon" center><Chip icon="stake" variant="accent">Staking</Chip></Cell>
        <Cell label="selected" center><Chip variant="outline" selected onClick={() => {}}>Selected</Chip></Cell>
        <Cell label="removable" center><Chip variant="neutral" removable onRemove={() => {}}>USDT</Chip></Cell>
      </Spec>
    </Section>
  )
}

function BadgeSection() {
  return (
    <Section title="Badge" hint="W=hug(min 18) H=fixed(18) · pad 0/6. Positioned over an icon by the parent (see IconButton).">
      <Spec title="dot / count">
        <Cell label="dot" center><Badge variant="dot" /></Cell>
        <Cell label="count 3" center><Badge variant="count" count={3} /></Cell>
        <Cell label="count 99+" center><Badge variant="count" count={140} /></Cell>
        <Cell label="tone accent" center><Badge variant="count" count={2} tone="accent" /></Cell>
      </Spec>

      <Spec title="In context, over an IconButton">
        <Cell label="notifications" center>
          <IconButton variant="solid" icon="bell" badge aria-label="New notifications" />
        </Cell>
      </Spec>
    </Section>
  )
}

function KeypadSection() {
  const [amount, setAmount] = useState('0')

  return (
    <Section title="Keypad" hint="column · W=fill H=hug · gap 8 · key fill H=fixed(56). Modes: amount (decimal point) and pin (Face ID).">
      <Spec title="Live example: amount mode" contract="one decimal point, 2 decimals max" column>
        <Text variant="display" align="center">${amount}</Text>
        <div style={{ maxWidth: 320, alignSelf: 'center', width: 320 }}>
          <Keypad mode="amount" onKey={(k) => setAmount((v) => typeKey(v, k))} onBackspace={() => setAmount(backspace)} />
        </div>
      </Spec>

      <Spec title="pin mode with Face ID">
        <div style={{ maxWidth: 320 }}>
          <Keypad mode="pin" showBiometric onKey={() => {}} onBackspace={() => {}} onBiometric={() => {}} />
        </div>
      </Spec>
    </Section>
  )
}

function SliderSection() {
  const [slippage, setSlippage] = useState(0.5)
  const [fee, setFee] = useState(40)

  return (
    <Section title="Slider" hint="column · W=fill H=hug · gap 8. Used for slippage on Swap and fee speed on Send.">
      <Spec title="Live example: slippage" column>
        <Slider
          min={0.1} max={5} step={0.1}
          value={slippage} onChange={setSlippage}
          label="Slippage" showValue
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </Spec>

      <Spec title="Live example: fee speed with ticks" column>
        <Slider
          min={0} max={100} step={25}
          value={fee} onChange={setFee}
          label="Speed" showValue showTicks
          formatValue={(v) => (v < 34 ? 'Slow' : v < 67 ? 'Normal' : 'Fast')}
        />
      </Spec>

      <Spec title="States">
        <Cell label="default" center><div style={{ width: 160 }}><Slider defaultValue={30} /></div></Cell>
        <Cell label="active" center><div style={{ width: 160 }}><Slider defaultValue={60} state="active" /></div></Cell>
        <Cell label="disabled" center><div style={{ width: 160 }}><Slider defaultValue={45} state="disabled" /></div></Cell>
      </Spec>
    </Section>
  )
}
