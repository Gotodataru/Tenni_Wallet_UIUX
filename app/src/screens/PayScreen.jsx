import { useEffect, useState } from 'react'
import {
  Screen, AppBar, IconButton, Avatar, Stack, Text, Chip, Button, Surface,
  ListRow, AssetIcon, EmptyState, Icon, Banner, ProgressDots, Amount,
  PayMoment,
} from '../ui/index.js'
import { HOLDINGS, RATES, CARD_LAST4 } from './data.js'
import { num } from './format.js'

/**
 * Pay — tap-to-pay at a card terminal, charged in crypto.
 *
 * The terminal sets the amount, not the user: the flow starts with the
 * merchant's request and the only choice is which asset to pay with.
 * The conversion fee is included in what gets charged, so the crypto
 * amount on every step already matches the total.
 *
 * request → confirm → processing → success | declined
 */

const MERCHANT = { name: 'Starbucks', place: 'Dubai · Marina Walk' }
const AED_PER_USD = 3.6725          // AED is pegged to the dollar, so the demo numbers don't age
const TERMINAL_AED = 45.54          // what the terminal asks for
const PURCHASE = TERMINAL_AED / AED_PER_USD   // $12.40
const FEE_RATE = 0.009              // 0.9% conversion fee
const FEE = Math.round(PURCHASE * FEE_RATE * 100) / 100
const TOTAL = PURCHASE + FEE

const STEPS = ['request', 'confirm', 'processing', 'success', 'declined']

const charge = (asset) => TOTAL / RATES[asset.symbol]
const cryptoPrecision = (asset) => (asset.symbol === 'usdt' ? 2 : 5)

function Merchant() {
  return (
    <Surface level={1} radius="lg" pad={0} gap={0}>
      <ListRow
        leading={<Avatar type="icon" icon="pay" size={40} />}
        title={MERCHANT.name}
        subtitle={MERCHANT.place}
        trailing={<Chip variant="accent" size="sm">NFC</Chip>}
      />
    </Surface>
  )
}

function RequestStep({ assetId, frozen, onUnfreeze, onPick, onNext }) {
  return (
    <Stack gap={20} fill>
      <Merchant />

      {frozen && (
        <Banner
          tone="danger"
          title="Your card is frozen"
          body="The terminal will decline it. Unfreeze the card to pay"
          action
          actionLabel="Unfreeze"
          onAction={onUnfreeze}
        />
      )}

      <Stack gap={6} align="center">
        <Text variant="caption" tone="dim">Terminal requests</Text>
        <Text variant="display" numeric>AED {num(TERMINAL_AED)}</Text>
        <Text variant="bodySm" tone="dim" numeric>≈ ${num(PURCHASE)} · 1 USD = {AED_PER_USD} AED</Text>
      </Stack>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Pay with</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          {HOLDINGS.map((h, i) => {
            const selected = h.symbol === assetId
            return (
              <ListRow
                key={h.symbol}
                leading={<AssetIcon symbol={h.symbol} size={40} />}
                title={h.name}
                subtitle={`${num(h.amount, h.precision)} ${h.ticker} available`}
                trailing={selected ? <Icon name="check-circle" size={24} tone="accent" /> : undefined}
                state={selected ? 'selected' : undefined}
                divider={i < HOLDINGS.length - 1}
                onClick={() => onPick(h.symbol)}
              />
            )
          })}
        </Surface>
      </Stack>

      <Stack fill justify="end">
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" state={frozen ? 'disabled' : undefined} onClick={onNext}>
          Continue
        </Button>
      </Stack>
    </Stack>
  )
}

/** Rate lock with a live countdown — refreshes itself when it runs out. */
function useRateLock(active) {
  const [left, setLeft] = useState(60)
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setLeft((s) => (s <= 1 ? 60 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [active])
  return left
}

function ConfirmStep({ asset, live, onPay, onBack }) {
  const secondsLeft = useRateLock(live)
  const p = cryptoPrecision(asset)

  return (
    <Stack gap={20} fill>
      <Merchant />

      <Stack gap={4} align="center">
        <Text variant="caption" tone="dim">You pay</Text>
        <Text variant="display" numeric>${num(TOTAL)}</Text>
        <Text variant="bodySm" tone="dim" numeric>{num(charge(asset), p)} {asset.ticker}</Text>
      </Stack>

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow size="sm" title="Purchase" trailing={<Amount value={PURCHASE} size="sm" tone="neutral" />} divider />
        <ListRow size="sm" title="Conversion fee · 0.9%" trailing={<Amount value={FEE} size="sm" tone="neutral" />} divider />
        <ListRow size="sm" title="Rate" trailing={<Text variant="bodySm" tone="dim" numeric>1 {asset.ticker} = ${num(RATES[asset.symbol])}</Text>} divider />
        <ListRow size="sm" title="Charged" trailing={<Amount value={charge(asset)} currency="" suffix={` ${asset.ticker}`} precision={p} size="sm" tone="neutral" />} />
      </Surface>

      <Banner tone="info" body={`Rate locked for ${secondsLeft} s`} />

      <Stack gap={12} fill justify="end">
        <Button variant="primary" size="xl" fullWidth iconLeading="face-id" onClick={onPay}>
          Confirm with Face ID
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onBack}>Change asset</Button>
      </Stack>
    </Stack>
  )
}

function ResultStep({ step, asset, last4, onRetry, onChangeAsset, onDone }) {
  const p = cryptoPrecision(asset)

  if (step === 'processing') {
    return (
      <Stack fill justify="center">
        <EmptyState
          illustration={<PayMoment state="processing" last4={last4} />}
          title="Processing payment"
          body={`${MERCHANT.name} · $${num(TOTAL)}. Keep this screen open. It usually takes a couple of seconds.`}
        />
      </Stack>
    )
  }

  if (step === 'success') {
    return (
      <Stack fill gap={20}>
        <Stack fill justify="center">
          <EmptyState
            illustration={<PayMoment state="success" last4={last4} />}
            title="Paid"
            body={`${MERCHANT.name} · $${num(TOTAL)} charged from your ${asset.ticker} balance`}
          />
        </Stack>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow size="sm" leading={<AssetIcon symbol={asset.symbol} size={32} />} title="Charged" trailing={<Amount value={charge(asset)} currency="" suffix={` ${asset.ticker}`} precision={p} size="sm" tone="neutral" />} divider />
          <ListRow size="sm" title="Receipt" trailing={<Text variant="bodySm" tone="dim">Sent to your email</Text>} chevron />
        </Surface>
        <Button variant="primary" size="xl" fullWidth onClick={onDone}>Done</Button>
      </Stack>
    )
  }

  return (
    <Stack fill gap={20}>
      <Stack fill justify="center">
        {/* Not the "offline" illustration: the network is fine, the
            merchant's bank said no. The same card as success, with a
            cross instead of a check, so the two outcomes read as a pair. */}
        <EmptyState
          illustration={<PayMoment state="declined" last4={last4} />}
          title="Payment declined"
          body="The merchant's bank didn't approve the payment. Nothing was charged."
        />
      </Stack>
      <Banner tone="warning" title="What you can do" body="Try again or pay with another asset. The rate will be recalculated." />
      <Stack gap={12}>
        <Button variant="primary" size="xl" fullWidth iconLeading="refresh" onClick={onRetry}>Try again</Button>
        <Button variant="secondary" size="lg" fullWidth iconLeading="swap" onClick={onChangeAsset}>Pay with another asset</Button>
      </Stack>
    </Stack>
  )
}

/**
 * step    — set from outside (the catalog shows every step statically)
 *           or driven internally, so the screen works as a live prototype.
 * outcome — what the live prototype ends with: success | declined.
 * onExit  — close the flow (the clickable prototype returns to Home).
 * frozen / last4 / onUnfreeze — the card as Card left it: a frozen card can't
 *           pay, and the way out is right on the request, not in Settings.
 */
export function PayScreen({ step: stepProp, outcome = 'success', theme = 'dark', scaled = false, frozen = false, last4 = CARD_LAST4, onUnfreeze, onExit }) {
  const [innerStep, setInnerStep] = useState('request')
  const [assetId, setAssetId] = useState('eth')
  const [attempt, setAttempt] = useState(0)   // a declined demo succeeds on the retry
  const step = stepProp || innerStep
  const asset = HOLDINGS.find((h) => h.symbol === assetId)

  const go = (s) => { if (!stepProp) setInnerStep(s) }
  const restart = () => { setAttempt(0); go('request'); onExit?.() }
  const retry = () => { setAttempt((a) => a + 1); go('processing') }
  const changeAsset = () => { setAttempt((a) => a + 1); go('request') }

  useEffect(() => {
    if (stepProp || step !== 'processing') return
    const declined = outcome === 'declined' && attempt === 0
    const t = setTimeout(() => setInnerStep(declined ? 'declined' : 'success'), 1800)
    return () => clearTimeout(t)
  }, [stepProp, step, outcome, attempt])

  const titles = {
    request: 'Pay',
    confirm: 'Confirm payment',
    processing: 'Payment',
    success: 'Payment',
    declined: 'Payment',
  }

  const close = <IconButton variant="ghost" size={32} icon="close" aria-label="Close" onClick={restart} />

  const appBar = (
    <AppBar
      layout="title-center"
      title={titles[step]}
      onBack={step === 'confirm' ? () => go('request') : undefined}
      leading={step === 'request' || step === 'declined' ? close : undefined}
      trailing={step === 'request' || step === 'confirm'
        ? <IconButton variant="ghost" size={32} icon="help" aria-label="Help" />
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
        {(step === 'request' || step === 'confirm') && (
          <Stack align="center">
            <ProgressDots total={2} active={step === 'request' ? 0 : 1} />
          </Stack>
        )}

        {step === 'request' && (
          <RequestStep assetId={assetId} frozen={frozen} onUnfreeze={onUnfreeze} onPick={setAssetId} onNext={() => go('confirm')} />
        )}

        {step === 'confirm' && (
          <ConfirmStep asset={asset} live={!stepProp} onPay={() => go('processing')} onBack={() => go('request')} />
        )}

        {(step === 'processing' || step === 'success' || step === 'declined') && (
          <ResultStep
            last4={last4}
            step={step}
            asset={asset}
            onRetry={retry}
            onChangeAsset={changeAsset}
            onDone={restart}
          />
        )}
      </Stack>
    </Screen>
  )
}

export { STEPS as PAY_STEPS }
