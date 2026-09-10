import { useState } from 'react'
import {
  Screen, AppBar, Stack, Text, Button, Surface, ListRow, Toggle,
  Avatar, CardVisual, ProgressDots, Banner,
} from '../ui/index.js'
import { USER, CARD_LAST4 } from './data.js'

/**
 * Onboarding — welcome → biometrics → create or import
 *
 * The welcome screen leads with the card itself: the product is "crypto
 * you can tap", so the first thing a new user sees is the thing they get.
 *
 * Create / import is where the real product would generate a key or ask
 * for a recovery phrase. The demo stops here on purpose — a public page
 * must never ask for a recovery phrase, not even a fake one — and says
 * so instead of silently doing nothing.
 */

const STEPS = ['welcome', 'biometric', 'choice']

function WelcomeStep({ onNext }) {
  return (
    <Stack fill justify="between" gap={32}>
      <Stack fill justify="center" gap={32}>
        <CardVisual skin="auto" kind="debit" holder={USER.holder} last4={CARD_LAST4} />
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
      <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onNext}>
        Get started
      </Button>
    </Stack>
  )
}

function BiometricStep({ faceId, onFaceId, notify, onNotify, onNext }) {
  return (
    <Stack fill justify="between" gap={24}>
      <Stack gap={24}>
        <Stack align="center">
          <ProgressDots total={2} active={0} />
        </Stack>

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

function ChoiceStep({ picked, onPick, onRestart, onFinish }) {
  return (
    <Stack fill justify="between" gap={24}>
      <Stack gap={24}>
        <Stack align="center">
          <ProgressDots total={2} active={1} />
        </Stack>

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
              chevron={!picked}
              state={picked === 'create' ? 'selected' : picked ? 'disabled' : undefined}
              onClick={picked ? undefined : () => onPick('create')}
            />
          </Surface>
          <Surface level={1} radius="lg" pad={0} gap={0}>
            <ListRow
              leading={<Avatar type="icon" icon="key" size={40} />}
              title="I already have a wallet"
              subtitle="Import with a recovery phrase"
              chevron={!picked}
              state={picked === 'import' ? 'selected' : picked ? 'disabled' : undefined}
              onClick={picked ? undefined : () => onPick('import')}
            />
          </Surface>
        </Stack>

        {picked && (
          <Banner
            tone="info"
            title="The demo stops here"
            body={picked === 'create'
              ? 'Next the app generates your keys and asks you to back up a recovery phrase. A public demo should never show or ask for one.'
              : 'Next the app asks for your recovery phrase. A public demo should never ask for one, not even a fake one.'}
          />
        )}
      </Stack>

      {picked && (
        <Stack gap={12}>
          {onFinish && (
            <Button variant="primary" size="xl" fullWidth iconTrailing="arrow-right" onClick={onFinish}>
              Open the demo wallet
            </Button>
          )}
          <Button variant="ghost" size="md" fullWidth onClick={onRestart}>Start over</Button>
        </Stack>
      )}
    </Stack>
  )
}

/**
 * step     — set from outside (the catalog shows every step statically)
 *            or driven internally, so the screen works as a live prototype.
 * onFinish — when given, the last step leads into the wallet (prototype).
 */
export function OnboardingScreen({ step: stepProp, theme = 'dark', scaled = false, onFinish }) {
  const [innerStep, setInnerStep] = useState('welcome')
  const [faceId, setFaceId] = useState(true)
  const [notify, setNotify] = useState(true)
  const [picked, setPicked] = useState(null)
  const step = stepProp || innerStep

  const go = (s) => { if (!stepProp) setInnerStep(s) }
  const restart = () => { setPicked(null); go('welcome') }

  const appBar = step === 'welcome' ? undefined : (
    <AppBar onBack={() => go(step === 'choice' ? 'biometric' : 'welcome')} />
  )

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      appBar={appBar}
      contentPadding={16}
    >
      <Stack gap={16} fill>
        {step === 'welcome' && <WelcomeStep onNext={() => go('biometric')} />}

        {step === 'biometric' && (
          <BiometricStep
            faceId={faceId} onFaceId={setFaceId}
            notify={notify} onNotify={setNotify}
            onNext={() => go('choice')}
          />
        )}

        {step === 'choice' && (
          <ChoiceStep picked={picked} onPick={setPicked} onRestart={restart} onFinish={onFinish} />
        )}
      </Stack>
    </Screen>
  )
}

export { STEPS as ONBOARDING_STEPS }
