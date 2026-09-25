import { useEffect, useState } from 'react'
import {
  Screen, AppBar, Stack, Text, Button, Surface, ListRow, Toggle, IconButton,
  CardVisual, Banner, Toast, Slider, BottomSheet, LockOverlay, Amount, Icon,
} from '../ui/index.js'
import { USER, CARD_LAST4 } from './data.js'
import { group, num, clock } from './format.js'

/**
 * Card — freeze, see the details, set a limit, report it lost.
 *
 * Every action is sized to its risk:
 * · Freeze is one toggle and undoes itself the same way — the thing to
 *   do the moment the card is missing from a pocket.
 * · The full number and CVC sit behind Face ID and hide again after
 *   30 s, so they don't stay on a screen someone else can see.
 * · Lowering a limit is instant; raising it past $5,000 asks for Face ID.
 * · Blocking is final, so its sheet offers the reversible option too:
 *   "Freeze instead" for a card that may still turn up.
 *
 * main → details (Face ID) · limits · lost (sheet) → replaced
 */

const STEPS = ['main', 'details', 'limits', 'lost', 'replaced']

const CHECKS = [
  { id: 'main-frozen', step: 'main', preset: 'frozen', label: 'Frozen' },
  { id: 'limits-high', step: 'limits', preset: 'high', label: 'Raising past $5,000' },
]

const NEW_LAST4 = '7730'
const fullNumber = (last4) => `424242424242${last4}`   // the same test-card prefix CardVisual prints
const EXPIRY = '12/29'
const CVC = '381'

const LIMIT = { min: 100, max: 10000, step: 100, initial: 2000, faceIdAbove: 5000 }
const SPENT_TODAY = 17.2   // Starbucks + Uber in the demo feed
const REVEAL_SECONDS = 30

/** A toast that fades by itself — part of the flow, above the content. */
function useFlash() {
  const [message, setMessage] = useState(null)
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 2600)
    return () => clearTimeout(t)
  }, [message])
  return [message, setMessage]
}

function MainStep({ frozen, onFreeze, limit, last4, flash, onDetails, onLimits, onLost }) {
  return (
    <Stack gap={20} fill>
      {flash && <Toast tone={flash.tone} message={flash.text} />}

      <CardVisual skin="ball" kind="debit" holder="" last4={last4} state={frozen ? 'frozen' : 'active'} />

      {frozen && (
        <Banner tone="info" body="Payments and cash withdrawals are blocked. Money in the wallet is safe and you can still send and receive crypto." />
      )}

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow
          leading={<Icon name={frozen ? 'unlock' : 'lock'} size={24} tone="dim" />}
          title="Freeze card"
          subtitle={frozen ? 'Frozen · turn off to pay again' : 'Block payments for a while'}
          trailing={<Toggle checked={frozen} onChange={onFreeze} aria-label="Freeze card" />}
          divider
        />
        <ListRow
          leading={<Icon name="eye" size={24} tone="dim" />}
          title="Show card details"
          subtitle="Number, expiry and CVC · Face ID"
          chevron
          onClick={onDetails}
          divider
        />
        <ListRow
          leading={<Icon name="card" size={24} tone="dim" />}
          title="Daily spending limit"
          subtitle={`$${num(limit, 0)} a day`}
          chevron
          onClick={onLimits}
        />
      </Surface>

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow
          leading={<Icon name="alert-triangle" size={24} tone="danger" />}
          title="Report lost or stolen"
          subtitle="Block this card and get a new one"
          chevron
          onClick={onLost}
        />
      </Surface>
    </Stack>
  )
}

/** Face ID first, then the details for 30 s. phase — auth | shown */
function DetailsStep({ live, last4, onHide }) {
  const [phase, setPhase] = useState(live ? 'auth' : 'shown')
  const [bio, setBio] = useState('idle')
  const [left, setLeft] = useState(REVEAL_SECONDS)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (phase !== 'auth') return
    const t1 = setTimeout(() => setBio('scanning'), 300)
    const t2 = setTimeout(() => setBio('success'), 1200)
    const t3 = setTimeout(() => setPhase('shown'), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [phase])

  useEffect(() => {
    if (!live || phase !== 'shown') return
    if (left <= 0) { onHide(); return }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, phase, left])

  if (phase === 'auth') return <Stack fill><LockOverlay method="faceid" state={bio} /></Stack>

  const number = fullNumber(last4)
  async function copy() {
    try { await navigator.clipboard.writeText(number) } catch { /* clipboard blocked — the toast still confirms the tap */ }
    setCopied(true)
  }

  return (
    <Stack gap={20} fill>
      {copied && <Toast tone="success" message="Card number copied" />}
      <CardVisual skin="ball" kind="debit" holder={USER.holder} last4={last4} expiry={EXPIRY} masked={false} />

      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow
          size="sm"
          title="Number"
          trailing={(
            <Stack dir="row" gap={8} align="center">
              <Text variant="mono">{group(number)}</Text>
              <IconButton variant="ghost" size={32} icon="copy" aria-label="Copy card number" onClick={copy} />
            </Stack>
          )}
          divider
        />
        <ListRow size="sm" title="Expiry" trailing={<Text variant="mono">{EXPIRY}</Text>} divider />
        <ListRow size="sm" title="CVC" trailing={<Text variant="mono">{CVC}</Text>} divider />
        <ListRow size="sm" title="Name on card" trailing={<Text variant="bodySm" tone="dim">{USER.holder}</Text>} />
      </Surface>

      <Banner tone="warning" title={`Hidden again in ${clock(left)}`} body="Never share the CVC. Tenni will never ask for it, not even in a call from support." />

      <Stack fill justify="end">
        <Button variant="secondary" size="lg" fullWidth iconLeading="eye-off" onClick={onHide}>Hide now</Button>
      </Stack>
    </Stack>
  )
}

/** Lowering saves at once; raising past the threshold asks for Face ID. */
function LimitsStep({ limit, preset, onSave }) {
  const [value, setValue] = useState(preset === 'high' ? 7500 : limit)
  const [confirming, setConfirming] = useState(false)
  const [bio, setBio] = useState('idle')
  const needsFaceId = value > LIMIT.faceIdAbove && value > limit

  useEffect(() => {
    if (!confirming) return
    const t1 = setTimeout(() => setBio('scanning'), 300)
    const t2 = setTimeout(() => setBio('success'), 1200)
    const t3 = setTimeout(() => onSave(value), 1700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirming])

  if (confirming) return <Stack fill><LockOverlay method="faceid" state={bio} /></Stack>

  return (
    <Stack gap={24} fill>
      <Stack gap={4} align="center">
        <Text variant="caption" tone="dim">Daily limit</Text>
        <Text variant="display" numeric>${num(value, 0)}</Text>
        <Stack dir="row" gap={4} align="center">
          <Text variant="bodySm" tone="dim">Spent today</Text>
          <Amount value={SPENT_TODAY} size="sm" tone="neutral" />
        </Stack>
      </Stack>

      <Slider
        min={LIMIT.min} max={LIMIT.max} step={LIMIT.step}
        value={value} onChange={setValue}
        label="Card payments and cash, per day"
        formatValue={(v) => `$${num(v, 0)}`}
      />

      {needsFaceId ? (
        <Banner tone="info" title="Face ID needed" body={`A limit above $${num(LIMIT.faceIdAbove, 0)} is what a thief would set first, so raising it asks for Face ID.`} />
      ) : (
        <Text variant="bodySm" tone="dim">A payment over the limit is declined at the terminal, and you get a notification.</Text>
      )}

      <Stack fill justify="end">
        <Button
          variant="primary" size="xl" fullWidth
          iconLeading={needsFaceId ? 'face-id' : undefined}
          state={value === limit ? 'disabled' : undefined}
          onClick={() => (needsFaceId ? setConfirming(true) : onSave(value))}
        >
          {needsFaceId ? 'Confirm with Face ID' : 'Save limit'}
        </Button>
      </Stack>
    </Stack>
  )
}

function LostSheet({ last4, onBlock, onFreeze, onClose }) {
  return (
    <BottomSheet
      title="Report lost or stolen"
      onClose={onClose}
      actions={(
        <Stack gap={12} fill>
          <Button variant="danger" size="lg" fullWidth onClick={onBlock}>Block and replace</Button>
          <Button variant="secondary" size="lg" fullWidth iconLeading="lock" onClick={onFreeze}>Freeze instead</Button>
        </Stack>
      )}
    >
      <Stack gap={8}>
        <Text variant="body">The card ••{last4} is blocked for good and a new one is sent to you.</Text>
        <Text variant="bodySm" tone="dim">Your money stays in the wallet. Not sure it’s gone? Freeze it — you can undo that.</Text>
      </Stack>
    </BottomSheet>
  )
}

function ReplacedStep({ oldLast4, onDone }) {
  return (
    <Stack gap={24} fill>
      <Stack gap={24} fill justify="center">
        <CardVisual skin="ball" kind="debit" holder="" last4={NEW_LAST4} />
        <Stack gap={8} align="center">
          <Text variant="h2" align="center">A new card is on its way</Text>
          <Text variant="body" tone="dim" align="center">
            The card ••{oldLast4} is blocked. The new virtual card works now; the plastic one arrives in 5–7 days.
          </Text>
        </Stack>
        <Banner tone="info" body="Subscriptions saved with the old card will fail. Update them with the new number." />
      </Stack>
      <Button variant="primary" size="xl" fullWidth onClick={onDone}>Done</Button>
    </Stack>
  )
}

/**
 * step        — set from outside (the catalog) or driven internally.
 * preset      — freezes a step in a state (catalog, see CHECKS).
 * frozen / onFreezeChange — the card state lives in the prototype, so
 *               Home and Pay see the same frozen card.
 * onReplaced(last4) — a new card was issued; onExit — back to Home.
 */
export function CardScreen({ step: stepProp, preset, theme = 'dark', scaled = false, frozen: frozenProp, onFreezeChange, last4 = CARD_LAST4, onReplaced, onExit }) {
  const [innerStep, setInnerStep] = useState('main')
  const [ownFrozen, setOwnFrozen] = useState(preset === 'frozen')
  const [limit, setLimit] = useState(LIMIT.initial)
  const [sheet, setSheet] = useState(false)
  const [flash, setFlash] = useFlash()
  const step = stepProp || innerStep
  const live = !stepProp

  const frozen = frozenProp ?? ownFrozen
  const setFrozen = (v) => { setOwnFrozen(v); onFreezeChange?.(v) }

  const go = (s) => { if (live) setInnerStep(s) }

  function freeze(v) {
    setFrozen(v)
    setFlash(v
      ? { tone: 'info', text: 'Card frozen. Nothing can be charged to it' }
      : { tone: 'success', text: 'Card unfrozen. You can pay again' })
  }

  const titles = { main: 'Card', details: 'Card details', limits: 'Spending limit', lost: 'Card', replaced: 'New card' }
  const appBar = (
    <AppBar
      layout="title-center"
      title={titles[step]}
      onBack={step === 'replaced' ? undefined : step === 'main' || step === 'lost' ? onExit : () => go('main')}
    />
  )

  const sheetOpen = step === 'lost' || sheet

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={appBar}
      contentPadding={16}
      overlay={sheetOpen && (
        <LostSheet
          last4={last4}
          onClose={() => setSheet(false)}
          onBlock={() => { setSheet(false); go('replaced') }}
          onFreeze={() => { setSheet(false); freeze(true) }}
        />
      )}
      onOverlayClose={() => setSheet(false)}
    >
      {(step === 'main' || step === 'lost') && (
        <MainStep
          frozen={frozen} onFreeze={freeze} limit={limit} last4={last4} flash={flash}
          onDetails={() => go('details')} onLimits={() => go('limits')} onLost={() => setSheet(true)}
        />
      )}
      {step === 'details' && <DetailsStep live={live} last4={last4} onHide={() => go('main')} />}
      {step === 'limits' && (
        <LimitsStep
          key={preset}
          limit={limit}
          preset={preset}
          onSave={(v) => { setLimit(v); setFlash({ tone: 'success', text: `Daily limit is now $${num(v, 0)}` }); go('main') }}
        />
      )}
      {step === 'replaced' && (
        <ReplacedStep oldLast4={last4} onDone={() => { setFrozen(false); onReplaced?.(NEW_LAST4); onExit?.() }} />
      )}
    </Screen>
  )
}

export { STEPS as CARD_STEPS, CHECKS as CARD_CHECKS }
