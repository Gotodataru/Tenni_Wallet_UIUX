import { useEffect, useState } from 'react'
import {
  Screen, AppBar, IconButton, Stack, Text, Input, Button, Surface,
  ListRow, Avatar, Chip, Banner, Keypad, LockOverlay, EmptyState,
  Amount, Icon, ProgressDots,
} from '../ui/index.js'
import { HOLDINGS, RATES } from './data.js'
import { group, shortHash, num, parseAmount, typeKey, backspace, detectAddress } from './format.js'

/**
 * Send — address → amount → review → Face ID → sent
 *
 * The three things that lose money in a crypto transfer are handled here:
 * · a wrong address — the field checks the format and catches an address
 *   from another network (ETH/Tron) before the user can continue;
 * · a swapped address — the review step shows the full address, grouped
 *   by 4 characters, never truncated in the middle;
 * · "Max" that ignores the fee — Max sends the balance minus the network
 *   fee, and the amount check always includes the fee.
 */

const STEPS = ['address', 'amount', 'review', 'confirm', 'success']

const BTC = HOLDINGS.find((h) => h.symbol === 'btc')
const FEE = 0.00012
const DECIMALS = 8
const DEFAULT_AMOUNT = '0.01'
const TX_HASH = 'a3f7e21c9b4d0f6e8a1c5b3d7f9e2a4c6b8d0f1e3a5c7b9d1f3e5a7c9b0d2f4e'

const RECENTS = [
  { id: 1, name: 'Leo Park', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { id: 2, name: 'Cold wallet', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' },
]

const initialsOf = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
const nameFor = (address) => RECENTS.find((r) => r.address === address.trim())?.name

const ADDRESS_ERROR = {
  invalid: "This doesn't look like a Bitcoin address",
  eth: 'This is an Ethereum address. BTC sent here will be lost',
  tron: 'This is a Tron address. BTC sent here will be lost',
}

/** Recipient card — the full address, never truncated. */
function Recipient({ address }) {
  const name = nameFor(address)
  return (
    <Surface level={1} radius="lg" pad={12} gap={12} dir="row">
      {name
        ? <Avatar type="initials" initials={initialsOf(name)} size={40} />
        : <Avatar type="icon" icon="user" size={40} />}
      <Stack gap={2} fill>
        <Text variant="caption" tone="dim">{name || 'Recipient'}</Text>
        <Text variant="mono">{group(address.trim())}</Text>
      </Stack>
    </Surface>
  )
}

function AddressStep({ address, onChange, onNext }) {
  const kind = detectAddress(address)
  const valid = kind === 'btc'
  const [pasteNote, setPasteNote] = useState(null)

  async function paste() {
    try {
      const text = await navigator.clipboard.readText()
      if (text) { onChange(text.trim()); setPasteNote(null); return }
    } catch { /* clipboard blocked */ }
    setPasteNote('Clipboard is empty or blocked. Pick a recent recipient below')
  }

  return (
    <Stack gap={20} fill>
      <Stack align="center">
        <ProgressDots total={3} active={0} />
      </Stack>

      <Input
        type="address"
        label="Recipient address"
        placeholder="bc1q…"
        value={address}
        onChange={(v) => { onChange(v); setPasteNote(null) }}
        state={valid ? 'success' : undefined}
        error={ADDRESS_ERROR[kind]}
        hint={pasteNote || (valid ? 'Bitcoin network · check the first and last 4 characters' : 'Transfers can’t be reversed. Only send to addresses you trust')}
        action={<Button variant="ghost" size="sm" onClick={paste}>Paste</Button>}
      />

      <Stack gap={8}>
        <Text variant="label" tone="dim">Recent</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          {RECENTS.map((r, i) => (
            <ListRow
              key={r.id}
              leading={<Avatar type="initials" initials={initialsOf(r.name)} size={40} />}
              title={r.name}
              subtitle={group(r.address)}
              chevron
              divider={i < RECENTS.length - 1}
              onClick={() => onChange(r.address)}
            />
          ))}
        </Surface>
      </Stack>

      <Stack fill justify="end">
        <Button
          variant="primary" size="xl" fullWidth iconTrailing="arrow-right"
          state={valid ? undefined : 'disabled'} onClick={onNext}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  )
}

function AmountStep({ address, value, onKey, onBackspace, onMax, onNext }) {
  const amount = parseAmount(value)
  const insufficient = amount + FEE > BTC.amount

  return (
    <Stack gap={16} fill>
      <Stack align="center">
        <ProgressDots total={3} active={1} />
      </Stack>

      <Recipient address={address} />

      <Stack gap={8} align="center" fill justify="center">
        <Stack dir="row" gap={8} align="baseline">
          <Text variant="display" numeric>{value || '0'}</Text>
          <Text variant="h2" tone="dim">{BTC.ticker}</Text>
        </Stack>
        <Text variant="caption" tone="dim" numeric>≈ ${num(amount * RATES.btc)}</Text>
        <Stack dir="row" gap={8} align="center">
          <Chip variant="neutral" size="sm">Available {num(BTC.amount, 4)} {BTC.ticker}</Chip>
          <Chip variant="outline" size="sm" onClick={onMax}>Max</Chip>
        </Stack>
      </Stack>

      {insufficient && <Banner tone="danger" body="Not enough BTC to cover the amount plus the network fee" />}

      <Keypad mode="amount" onKey={onKey} onBackspace={onBackspace} />

      <Button
        variant="primary" size="xl" fullWidth iconTrailing="arrow-right"
        state={amount > 0 && !insufficient ? undefined : 'disabled'} onClick={onNext}
      >
        Next
      </Button>
    </Stack>
  )
}

function ReviewStep({ address, value, onConfirm, onEdit }) {
  const amount = parseAmount(value)

  return (
    <Stack gap={20} fill>
      <Stack align="center">
        <ProgressDots total={3} active={2} />
      </Stack>

      <Recipient address={address} />

      <Stack gap={4} align="center">
        <Text variant="caption" tone="dim">You're sending</Text>
        <Text variant="display" numeric>{value} {BTC.ticker}</Text>
        <Text variant="bodySm" tone="dim" numeric>≈ ${num(amount * RATES.btc)}</Text>
      </Stack>

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow size="sm" title="Amount" trailing={<Amount value={amount} currency="" suffix={` ${BTC.ticker}`} precision={5} size="sm" tone="neutral" />} divider />
        <ListRow size="sm" title="Network fee" trailing={<Amount value={FEE} currency="" suffix={` ${BTC.ticker}`} precision={5} size="sm" tone="neutral" />} divider />
        <ListRow size="sm" title="Total" trailing={<Amount value={amount + FEE} currency="" suffix={` ${BTC.ticker}`} precision={5} size="sm" tone="neutral" />} />
      </Surface>

      <Banner tone="warning" title="Check the address" body="Blockchain transfers can't be reversed. Compare the recipient character by character" />

      <Stack gap={12} fill justify="end">
        <Button variant="primary" size="xl" fullWidth iconLeading="face-id" onClick={onConfirm}>
          Confirm with Face ID
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onEdit}>Edit amount</Button>
      </Stack>
    </Stack>
  )
}

/** The biometric step: LockOverlay drives the scenario idle → scanning → success. */
function ConfirmStep({ onDone }) {
  const [bio, setBio] = useState('idle')

  useEffect(() => {
    const t1 = setTimeout(() => setBio('scanning'), 500)
    const t2 = setTimeout(() => setBio('success'), 1500)
    const t3 = setTimeout(() => onDone(), 2300)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack fill>
      <LockOverlay method="faceid" state={bio} />
    </Stack>
  )
}

function SuccessStep({ address, value, onDone }) {
  const name = nameFor(address)
  return (
    <Stack fill gap={16}>
      <Stack fill justify="center">
        <EmptyState
          illustration={<Icon name="check-circle" size={56} tone="success" />}
          title="Sent"
          body={`${value} ${BTC.ticker} is on its way${name ? ` to ${name}` : ''}. It usually confirms in 10–30 minutes.`}
        />
      </Stack>

      <Recipient address={address} />

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow size="sm" title="Transaction" trailing={<Text variant="mono" tone="dim">{shortHash(TX_HASH)}</Text>} chevron divider />
        <ListRow size="sm" title="Network fee" trailing={<Amount value={FEE} currency="" suffix={` ${BTC.ticker}`} precision={5} size="sm" tone="neutral" />} />
      </Surface>

      <Button variant="primary" size="xl" fullWidth onClick={onDone}>Done</Button>
    </Stack>
  )
}

/**
 * step   — set from outside (the catalog shows every step statically)
 *          or driven internally, so the screen works as a live prototype.
 * onExit — close the flow (the clickable prototype returns to Home).
 */
export function SendScreen({ step: stepProp, theme = 'dark', scaled = false, onExit }) {
  const [innerStep, setInnerStep] = useState('address')
  const [address, setAddress] = useState(stepProp ? RECENTS[0].address : '')
  const [value, setValue] = useState(DEFAULT_AMOUNT)
  const step = stepProp || innerStep

  const go = (s) => { if (!stepProp) setInnerStep(s) }
  const restart = () => { setAddress(''); setValue(DEFAULT_AMOUNT); go('address'); onExit?.() }

  const handleKey = (key) => setValue((v) => typeKey(v, key, { decimals: DECIMALS, maxInt: 3 }))
  const handleBackspace = () => setValue(backspace)
  const handleMax = () => setValue(String(Number((BTC.amount - FEE).toFixed(DECIMALS))))

  const titles = {
    address: 'Send bitcoin',
    amount: 'Amount',
    review: 'Review transfer',
    confirm: 'Confirm',
    success: 'Sent',
  }

  const back = { amount: 'address', review: 'amount' }[step]

  const appBar = (
    <AppBar
      layout="title-center"
      title={titles[step]}
      onBack={back ? () => go(back) : undefined}
      leading={step === 'address'
        ? <IconButton variant="ghost" size={32} icon="close" aria-label="Close" onClick={restart} />
        : undefined}
    />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={appBar}
      contentPadding={16}
    >
      <Stack gap={16} fill>
        {step === 'address' && (
          <AddressStep address={address} onChange={setAddress} onNext={() => go('amount')} />
        )}

        {step === 'amount' && (
          <AmountStep
            address={address} value={value}
            onKey={handleKey} onBackspace={handleBackspace} onMax={handleMax}
            onNext={() => go('review')}
          />
        )}

        {step === 'review' && (
          <ReviewStep address={address} value={value} onConfirm={() => go('confirm')} onEdit={() => go('amount')} />
        )}

        {step === 'confirm' && <ConfirmStep onDone={() => go('success')} />}

        {step === 'success' && <SuccessStep address={address} value={value} onDone={restart} />}
      </Stack>
    </Screen>
  )
}

export { STEPS as SEND_STEPS }
