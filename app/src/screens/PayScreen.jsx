import { useEffect, useState } from 'react'
import {
  Screen, AppBar, IconButton, Avatar, Stack, Text, Chip, Button, Surface,
  ListRow, AssetIcon, EmptyState, Icon, Banner, ProgressDots, Amount,
  PayMoment, Toggle, LockOverlay,
} from '../ui/index.js'
import { HOLDINGS, RATES, CARD_LAST4 } from './data.js'
import { num, clock } from './format.js'

/**
 * Pay — tap the phone at a card terminal, charged in crypto.
 *
 * How a card payment really runs, and so how this flow runs: the coin is
 * chosen BEFORE the tap, and the amount is known only AFTER it. A phone
 * can't see the bill until it touches the reader, and the terminal
 * authorizes in a second — there is no moment to pick a coin once the
 * amount is on screen. So:
 *
 *   ready (pick the coin, the backup) → Face ID → hold near the reader →
 *   processing (the terminal answers: merchant, amount) → success | declined
 *
 * The questions this order raises are the design:
 * · "How much will it take?" — the ready screen can't show a number, so it
 *   shows the rule: the rate at the moment of payment, the 0.9% fee
 *   included; the full breakdown comes with the result.
 * · "What if the coin runs short?" — a backup coin covers the rest,
 *   decided up front, not at the till.
 * · The same "Pay with" choice is what the plastic card spends, so it
 *   lives on Home too, under the card.
 */

const MERCHANT = { name: 'Starbucks', place: 'Dubai · Marina Walk' }
const AED_PER_USD = 3.6725          // AED is pegged to the dollar, so the demo numbers don't age
const TERMINAL_AED = 45.54          // what the terminal asks for
const PURCHASE = TERMINAL_AED / AED_PER_USD   // $12.40
const FEE_RATE = 0.009              // 0.9% conversion fee
const FEE = Math.round(PURCHASE * FEE_RATE * 100) / 100
const TOTAL = PURCHASE + FEE
const READY_SECONDS = 60            // after Face ID the phone stays ready to pay, like any phone wallet
const READER_MS = 2600              // the demo "finds" the reader on its own

const STEPS = ['ready', 'faceid', 'hold', 'processing', 'success', 'declined']

const charge = (asset) => TOTAL / RATES[asset.symbol]
const cryptoPrecision = (asset) => (asset.symbol === 'usdt' ? 2 : 5)
const valueOf = (h) => h.amount * RATES[h.symbol]
/** The backup is the stablecoin, or ETH when the stablecoin is the main coin. */
const backupFor = (asset) => HOLDINGS.find((h) => h.symbol === (asset.symbol === 'usdt' ? 'eth' : 'usdt'))

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

function ReadyStep({ asset, backup, backupOn, onBackup, frozen, onUnfreeze, onPick, onPay }) {
  return (
    <Stack gap={20} fill>
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

      <Stack gap={8}>
        <Text variant="label" tone="dim">Pay with</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          {HOLDINGS.map((h, i) => {
            const selected = h.symbol === asset.symbol
            return (
              <ListRow
                key={h.symbol}
                leading={<AssetIcon symbol={h.symbol} size={40} />}
                title={h.name}
                subtitle={`${num(h.amount, h.precision)} ${h.ticker} · up to $${num(valueOf(h), 0)}`}
                trailing={selected ? <Icon name="check-circle" size={24} tone="accent" /> : undefined}
                state={selected ? 'selected' : undefined}
                divider={i < HOLDINGS.length - 1}
                onClick={() => onPick(h.symbol)}
              />
            )
          })}
        </Surface>
      </Stack>

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow
          leading={<AssetIcon symbol={backup.symbol} size={40} />}
          title={`Backup: ${backup.name}`}
          subtitle={`Covers what ${asset.ticker} can’t`}
          trailing={<Toggle checked={backupOn} onChange={onBackup} aria-label={`Backup: ${backup.name}`} />}
        />
      </Surface>

      <Banner
        tone="info"
        title="The terminal sets the amount"
        body={`You’ll see it after the tap. ${asset.ticker} is converted at that moment’s rate, and the 0.9% fee is included in what’s charged.`}
      />

      <Stack fill justify="end">
        <Button
          variant="primary" size="xl" fullWidth iconLeading="face-id"
          state={frozen ? 'disabled' : undefined} onClick={onPay}
        >
          {`Pay with ${asset.name}`}
        </Button>
      </Stack>
    </Stack>
  )
}

/** Face ID unlocks the card for one payment: idle → scanning → success. */
function FaceIdStep({ onDone }) {
  const [bio, setBio] = useState('idle')

  useEffect(() => {
    const t1 = setTimeout(() => setBio('scanning'), 400)
    const t2 = setTimeout(() => setBio('success'), 1300)
    const t3 = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Stack fill><LockOverlay method="faceid" state={bio} /></Stack>
}

/**
 * Ready to pay: the waves say "looking for a reader". The ready window
 * counts down; when it runs out the phone locks the card again.
 */
function HoldStep({ asset, backup, backupOn, last4, live, onReader, onTimeout, onCancel }) {
  const [left, setLeft] = useState(READY_SECONDS)

  useEffect(() => {
    if (!live) return
    const t = setTimeout(onReader, READER_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live])

  useEffect(() => {
    if (!live) return
    if (left <= 0) { onTimeout(); return }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, left])

  return (
    <Stack fill gap={16}>
      <Stack fill justify="center">
        <EmptyState
          illustration={<PayMoment state="processing" last4={last4} />}
          title="Hold near the reader"
          body={`Top of the phone to the terminal. Ready for ${clock(left)}.`}
        />
      </Stack>
      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow
          size="sm"
          leading={<AssetIcon symbol={asset.symbol} size={32} />}
          title={`Paying with ${asset.name}`}
          trailing={<Text variant="bodySm" tone="dim">{backupOn ? `Backup ${backup.ticker}` : 'No backup'}</Text>}
        />
      </Surface>
      <Button variant="ghost" size="md" fullWidth onClick={onCancel}>Cancel</Button>
    </Stack>
  )
}

function ResultStep({ step, asset, last4, onRetry, onChangeAsset, onDone }) {
  const p = cryptoPrecision(asset)

  if (step === 'processing') {
    return (
      <Stack fill justify="center" gap={16}>
        <EmptyState
          illustration={<PayMoment state="processing" last4={last4} />}
          title={`Paying ${MERCHANT.name}`}
          body={`AED ${num(TERMINAL_AED)} ≈ $${num(PURCHASE)}. Keep the phone near the reader.`}
        />
      </Stack>
    )
  }

  if (step === 'success') {
    return (
      <Stack fill gap={16}>
        <Stack fill justify="center">
          <EmptyState
            illustration={<PayMoment state="success" last4={last4} />}
            title="Paid"
            body={`${MERCHANT.name} · $${num(TOTAL)} from your ${asset.ticker} balance`}
          />
        </Stack>
        {/* The breakdown the ready screen couldn't show: it exists only now. */}
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow size="sm" title={`Terminal · AED ${num(TERMINAL_AED)}`} trailing={<Amount value={PURCHASE} size="sm" tone="neutral" />} divider />
          <ListRow size="sm" title="Conversion fee · 0.9%" trailing={<Amount value={FEE} size="sm" tone="neutral" />} divider />
          <ListRow size="sm" title="Rate" trailing={<Text variant="bodySm" tone="dim" numeric>1 {asset.ticker} = ${num(RATES[asset.symbol])}</Text>} divider />
          <ListRow size="sm" leading={<AssetIcon symbol={asset.symbol} size={32} />} title="Charged" trailing={<Amount value={charge(asset)} currency="" suffix={` ${asset.ticker}`} precision={p} size="sm" tone="neutral" />} />
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
          body={`${MERCHANT.name} · AED ${num(TERMINAL_AED)}. The merchant’s bank didn’t approve it. Nothing was charged.`}
        />
      </Stack>
      <Banner tone="warning" title="What you can do" body="Tap again, or pay with another coin. Each try asks for Face ID once more." />
      <Stack gap={12}>
        <Button variant="primary" size="xl" fullWidth iconLeading="refresh" onClick={onRetry}>Try again</Button>
        <Button variant="secondary" size="lg" fullWidth iconLeading="swap" onClick={onChangeAsset}>Pay with another coin</Button>
      </Stack>
    </Stack>
  )
}

/**
 * step    — set from outside (the catalog shows every step statically)
 *           or driven internally, so the screen works as a live prototype.
 * outcome — what the live prototype ends with: success | declined.
 * asset / onAssetChange — the "Pay with" coin, shared with Home: the same
 *           choice the plastic card spends.
 * onExit  — close the flow (the clickable prototype returns to Home).
 * frozen / last4 / onUnfreeze — the card as Card left it: a frozen card can't
 *           pay, and the way out is right on the ready screen, not in Settings.
 */
export function PayScreen({ step: stepProp, outcome = 'success', theme = 'dark', scaled = false, asset: assetProp = 'eth', onAssetChange, frozen = false, last4 = CARD_LAST4, onUnfreeze, onExit }) {
  const [innerStep, setInnerStep] = useState('ready')
  const [assetId, setAssetId] = useState(assetProp)
  const [backupOn, setBackupOn] = useState(true)
  const [attempt, setAttempt] = useState(0)   // a declined demo succeeds on the retry
  const step = stepProp || innerStep
  const live = !stepProp
  const asset = HOLDINGS.find((h) => h.symbol === assetId)
  const backup = backupFor(asset)

  const go = (s) => { if (live) setInnerStep(s) }
  const pick = (id) => { setAssetId(id); onAssetChange?.(id) }
  const restart = () => { setAttempt(0); go('ready'); onExit?.() }
  const retry = () => { setAttempt((a) => a + 1); go('faceid') }
  const changeAsset = () => { setAttempt((a) => a + 1); go('ready') }

  useEffect(() => {
    if (!live || step !== 'processing') return
    const declined = outcome === 'declined' && attempt === 0
    const t = setTimeout(() => setInnerStep(declined ? 'declined' : 'success'), 1800)
    return () => clearTimeout(t)
  }, [live, step, outcome, attempt])

  const close = <IconButton variant="ghost" size={32} icon="close" aria-label="Close" onClick={restart} />

  const appBar = (
    <AppBar
      layout="title-center"
      title="Pay"
      leading={step === 'ready' || step === 'declined' ? close : undefined}
      trailing={step === 'ready'
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
        {(step === 'ready' || step === 'hold') && (
          <Stack align="center">
            <ProgressDots total={2} active={step === 'ready' ? 0 : 1} />
          </Stack>
        )}

        {step === 'ready' && (
          <ReadyStep
            asset={asset} backup={backup} backupOn={backupOn} onBackup={setBackupOn}
            frozen={frozen} onUnfreeze={onUnfreeze} onPick={pick} onPay={() => go('faceid')}
          />
        )}

        {step === 'faceid' && (live ? <FaceIdStep onDone={() => go('hold')} /> : <Stack fill><LockOverlay method="faceid" state="scanning" /></Stack>)}

        {step === 'hold' && (
          <HoldStep
            asset={asset} backup={backup} backupOn={backupOn} last4={last4} live={live}
            onReader={() => go('processing')} onTimeout={() => go('ready')} onCancel={() => go('ready')}
          />
        )}

        {(step === 'processing' || step === 'success' || step === 'declined') && (
          <>
            {step === 'processing' && <Merchant />}
            <ResultStep
              last4={last4}
              step={step}
              asset={asset}
              onRetry={retry}
              onChangeAsset={changeAsset}
              onDone={restart}
            />
          </>
        )}
      </Stack>
    </Screen>
  )
}

export { STEPS as PAY_STEPS }
