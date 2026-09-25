import { useEffect, useState } from 'react'
import {
  Screen, AppBar, Stack, Text, Button, Surface, ListRow, Toggle,
  Avatar, CardStage, ProgressDots, Banner, Chip, LockOverlay, EmptyState, Icon,
} from '../ui/index.js'
import { USER, CARD_LAST4 } from './data.js'
import { EmailStep, CodeStep, PasscodeCreate } from './AuthSteps.jsx'

/**
 * Onboarding (sign-up) — welcome → email → code → passcode → Face ID →
 * create or import → backup. Identity and the card come next, in Verify.
 *
 * The welcome screen leads with the card itself: the product is "crypto
 * you can tap", so the first thing a new user sees is the thing they get.
 *
 * Create backs the new wallet up with a passkey — the key is saved in the
 * phone's password manager behind Face ID, so there is no phrase to show.
 * The recovery-phrase route and import stop with a note instead: a
 * public page must never show or ask for a recovery phrase, not even a
 * fake one.
 */

const STEPS = ['welcome', 'email', 'code', 'passcode', 'confirm', 'biometric', 'choice', 'backup']

/** Error and end states for the catalog: every check the flow makes, frozen. */
const CHECKS = [
  { id: 'email-taken', step: 'email', preset: 'taken', label: 'Email already has an account' },
  { id: 'email-terms', step: 'email', preset: 'terms', label: 'Terms not accepted' },
  { id: 'code-wrong', step: 'code', preset: 'wrong', label: 'Wrong code' },
  { id: 'code-locked', step: 'code', preset: 'locked', label: 'Too many wrong codes' },
  { id: 'passcode-weak', step: 'passcode', preset: 'weak', label: 'Passcode too easy' },
  { id: 'passcode-mismatch', step: 'passcode', preset: 'mismatch', label: 'Passcodes don’t match' },
  { id: 'backup-saved', step: 'backup', preset: 'saved', label: 'Backed up' },
]

/** Five dots for eight steps: the passcode and its repeat are one step to
    the user, and so are choosing a wallet and backing it up. */
const DOT = { email: 0, code: 1, passcode: 2, confirm: 2, biometric: 3, choice: 4, backup: 4 }
const BACK = { email: 'welcome', code: 'email', confirm: 'passcode', choice: 'biometric', backup: 'choice' }

function WelcomeStep({ onNext, onSignIn }) {
  return (
    <Stack fill justify="between" gap={24}>
      <Stack fill justify="center" gap={24}>
        <CardStage holder={USER.holder} last4={CARD_LAST4} />
        <Stack gap={12}>
          <Stack gap={0}>
            <Text variant="display">Your card.</Text>
            <Text variant="display">Your coins.</Text>
            <Text variant="display" tone="accent">One wallet.</Text>
          </Stack>
          <Text variant="body" tone="dim">
            Pay with crypto anywhere cards are accepted. Send, receive and swap without leaving the app.
          </Text>
        </Stack>
      </Stack>
      <Stack gap={12}>
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onNext}>
          Get started
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onSignIn}>I already have an account</Button>
      </Stack>
    </Stack>
  )
}

function BiometricStep({ faceId, onFaceId, notify, onNotify, onNext }) {
  return (
    <Stack fill justify="between" gap={24}>
      <Stack gap={24}>
        <Stack align="center" gap={16}>
          <Avatar type="icon" icon="face-id" size={56} />
          <Stack gap={4} align="center">
            <Text variant="h2" align="center">Protect your wallet</Text>
            <Text variant="bodySm" tone="dim" align="center">
              Face ID confirms sign-ins and payments. It’s faster than a passcode.
            </Text>
          </Stack>
        </Stack>

        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow
            leading={<Avatar type="icon" icon="face-id" size={40} />}
            title="Face ID"
            subtitle="Sign-ins and payment confirmation"
            trailing={<Toggle checked={faceId} onChange={onFaceId} aria-label="Face ID" />}
            divider
          />
          <ListRow
            leading={<Avatar type="icon" icon="bell" size={40} />}
            title="Notifications"
            subtitle="Payments and new sign-ins"
            trailing={<Toggle checked={notify} onChange={onNotify} aria-label="Notifications" />}
          />
        </Surface>
      </Stack>

      <Stack gap={12}>
        <Button variant="primary" size="xl" fullWidth onClick={onNext}>Continue</Button>
        <Button variant="ghost" size="md" fullWidth onClick={onNext}>Not now</Button>
      </Stack>
    </Stack>
  )
}

function ChoiceStep({ importing, onImport, onCreate, onRestart, onFinish }) {
  return (
    <Stack fill justify="between" gap={24}>
      <Stack gap={24}>
        <Stack gap={4} align="center">
          <Text variant="h2" align="center">Set up your wallet</Text>
          <Text variant="bodySm" tone="dim" align="center">Create a new one or bring a wallet you already use</Text>
        </Stack>

        <Stack gap={12}>
          <Surface level={1} radius="lg" pad={0} gap={0}>
            <ListRow
              leading={<Avatar type="icon" icon="shield" size={40} />}
              title="Create a new wallet"
              subtitle="Recommended if you're new to crypto"
              chevron={!importing}
              state={importing ? 'disabled' : undefined}
              onClick={importing ? undefined : onCreate}
            />
          </Surface>
          <Surface level={1} radius="lg" pad={0} gap={0}>
            <ListRow
              leading={<Avatar type="icon" icon="key" size={40} />}
              title="I already have a wallet"
              subtitle="Import with a recovery phrase"
              chevron={!importing}
              state={importing ? 'selected' : undefined}
              onClick={importing ? undefined : onImport}
            />
          </Surface>
        </Stack>

        {importing && (
          <Banner
            tone="info"
            title="The demo skips the import"
            body="Next the app asks for your recovery phrase. A public demo should never ask for one, not even a fake one."
          />
        )}
      </Stack>

      {importing && (
        <Stack gap={12}>
          <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onFinish}>
            Continue with a demo wallet
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={onRestart}>Choose again</Button>
        </Stack>
      )}
    </Stack>
  )
}

/** Face ID unlocks the passkey: LockOverlay plays idle → scanning → success. */
function SavingStep({ onDone }) {
  const [bio, setBio] = useState('idle')

  useEffect(() => {
    const t1 = setTimeout(() => setBio('scanning'), 400)
    const t2 = setTimeout(() => setBio('success'), 1400)
    const t3 = setTimeout(() => onDone(), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Stack fill><LockOverlay method="faceid" state={bio} /></Stack>
}

/**
 * The backup: a passkey by default, the phrase as the other option.
 * phase — choose | saving | saved; `saved` can be set from the catalog.
 */
function BackupStep({ phase: phaseProp, onFinish }) {
  const [innerPhase, setPhase] = useState('choose')
  const [method, setMethod] = useState('passkey')
  const phase = phaseProp || innerPhase

  if (phase === 'saving') return <SavingStep onDone={() => setPhase('saved')} />

  if (phase === 'saved') {
    return (
      <Stack fill gap={16}>
        <Stack fill justify="center">
          <EmptyState
            illustration={<Icon name="check-circle" size={56} tone="success" />}
            title="Wallet backed up"
            body="Your key is saved in your passkey. On a new phone, sign in and Face ID brings the wallet back."
          />
        </Stack>
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onFinish}>Continue</Button>
      </Stack>
    )
  }

  return (
    <Stack fill justify="between" gap={24}>
      <Stack gap={24}>
        <Stack gap={4} align="center">
          <Text variant="h2" align="center">Back up your wallet</Text>
          <Text variant="bodySm" tone="dim" align="center">
            If this phone is lost, the backup is the only way back to your money. Tenni can’t restore it for you.
          </Text>
        </Stack>

        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow
            leading={<Avatar type="icon" icon="key" size={40} />}
            title="Passkey"
            subtitle="In your phone’s password manager, behind Face ID"
            trailing={<Chip variant="accent" size="sm">Recommended</Chip>}
            state={method === 'passkey' ? 'selected' : undefined}
            onClick={() => setMethod('passkey')}
            divider
          />
          <ListRow
            leading={<Avatar type="icon" icon="seed" size={40} />}
            title="Recovery phrase"
            subtitle="12 words you write down and keep offline"
            state={method === 'phrase' ? 'selected' : undefined}
            onClick={() => setMethod('phrase')}
          />
        </Surface>

        {method === 'phrase' && (
          <Banner
            tone="info"
            title="The demo skips the phrase"
            body="Here the app would show 12 words to write down. A public demo should never show a recovery phrase, not even a fake one."
          />
        )}
      </Stack>

      {method === 'passkey' ? (
        <Button variant="primary" size="xl" fullWidth iconLeading="face-id" onClick={() => setPhase('saving')}>
          Back up with passkey
        </Button>
      ) : (
        <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onFinish}>
          Skip in the demo
        </Button>
      )}
    </Stack>
  )
}

/**
 * step       — set from outside (the catalog shows every step statically)
 *              or driven internally, so the screen works as a live prototype.
 * preset     — freezes a step in an error or end state (catalog, see CHECKS).
 * onFinish   — the wallet is set up: the prototype goes on to Verify.
 * onSignIn   — "I already have an account" / "Sign in instead".
 * onPasscode — the passcode the user created, so Unlock can check it.
 */
export function OnboardingScreen({ step: stepProp, preset, theme = 'dark', scaled = false, onFinish, onSignIn, onPasscode }) {
  const [innerStep, setInnerStep] = useState('welcome')
  const [email, setEmail] = useState(stepProp ? 'nina.ross@example.com' : '')
  const [faceId, setFaceId] = useState(true)
  const [notify, setNotify] = useState(true)
  const [importing, setImporting] = useState(false)
  const step = stepProp || innerStep
  const live = !stepProp

  const go = (s) => { if (live) setInnerStep(s) }

  const appBar = step === 'welcome' ? undefined : (
    <AppBar onBack={BACK[step] && live ? () => go(BACK[step]) : undefined} />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={appBar}
      contentPadding={16}
    >
      <Stack gap={16} fill>
        {DOT[step] !== undefined && (
          <Stack align="center">
            <ProgressDots total={5} active={DOT[step]} />
          </Stack>
        )}

        {step === 'welcome' && <WelcomeStep onNext={() => go('email')} onSignIn={onSignIn} />}

        {step === 'email' && (
          <EmailStep key={preset} mode="signup" value={email} onChange={setEmail} preset={preset} onNext={() => go('code')} onSignIn={onSignIn} />
        )}

        {step === 'code' && (
          <CodeStep key={preset} email={email} live={live} preset={preset} onNext={() => go('passcode')} onChangeEmail={() => go('email')} />
        )}

        {(step === 'passcode' || step === 'confirm') && (
          <PasscodeCreate
            key={preset}
            phase={live ? undefined : (step === 'confirm' ? 'confirm' : 'create')}
            preset={preset}
            onDone={(code) => { onPasscode?.(code); go('biometric') }}
          />
        )}

        {step === 'biometric' && (
          <BiometricStep
            faceId={faceId} onFaceId={setFaceId}
            notify={notify} onNotify={setNotify}
            onNext={() => go('choice')}
          />
        )}

        {step === 'choice' && (
          <ChoiceStep
            importing={importing}
            onImport={() => setImporting(true)}
            onCreate={() => go('backup')}
            onRestart={() => setImporting(false)}
            onFinish={onFinish}
          />
        )}

        {step === 'backup' && <BackupStep phase={preset === 'saved' ? 'saved' : undefined} onFinish={onFinish} />}
      </Stack>
    </Screen>
  )
}

export { STEPS as ONBOARDING_STEPS, CHECKS as ONBOARDING_CHECKS }
