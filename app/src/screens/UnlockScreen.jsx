import { useEffect, useState } from 'react'
import { Screen, Stack, Text, Button, LockOverlay } from '../ui/index.js'
import { USER, DEMO_PASSCODE, passcodeHint } from './data.js'
import { PasscodeEntry } from './AuthSteps.jsx'
import { UserAvatar } from './UserAvatar.jsx'

/**
 * Unlock — the app comes back from the background: Face ID first, the
 * passcode when Face ID can't.
 *
 * In the prototype Face ID just works — a demo that fails on its own
 * reads as a broken demo. The failure is one switch away (`faceId`,
 * the catalog's live flow): not recognized → retry or the passcode. The
 * passcode pad keeps a Face ID key: one tap back to the faster way.
 *
 * faceid → failed → passcode (→ paused after 5 wrong) · forgot → Sign in
 */

const STEPS = ['faceid', 'failed', 'passcode']

const CHECKS = [
  { id: 'passcode-wrong', step: 'passcode', preset: 'wrong', label: 'Wrong passcode' },
  { id: 'passcode-locked', step: 'passcode', preset: 'locked', label: 'Paused after 5 tries' },
]

/** One Face ID attempt: idle → scanning → success, or failed on the first try when `failFirst`. */
function FaceScan({ attempt, failFirst, onResult }) {
  const [bio, setBio] = useState('idle')

  useEffect(() => {
    const ok = !failFirst || attempt > 0
    const t1 = setTimeout(() => setBio('scanning'), 500)
    const t2 = setTimeout(() => setBio(ok ? 'success' : 'failed'), 2000)
    const t3 = setTimeout(() => onResult(ok), ok ? 2600 : 2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  return <LockOverlay method="faceid" state={bio} />
}

function Who({ user }) {
  return (
    <Stack align="center" gap={12}>
      <UserAvatar user={user} size={56} />
      <Text variant="title" align="center">Welcome back, {user.name.split(' ')[0]}</Text>
    </Stack>
  )
}

/**
 * faceId — how the live scan goes: works | fails (the first scan, then works).
 * user   — who is signed in.
 */
export function UnlockScreen({ step: stepProp, preset, faceId = 'works', user = USER, passcode = DEMO_PASSCODE, theme = 'dark', scaled = false, onUnlock, onForgot }) {
  const [innerStep, setInnerStep] = useState('faceid')
  const [attempt, setAttempt] = useState(0)
  const step = stepProp || innerStep
  const live = !stepProp

  const scanAgain = () => { setAttempt((a) => a + 1); setInnerStep('faceid') }

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={theme}
      contentPadding={16}
    >
      <Stack gap={24} fill pad={step === 'passcode' ? 0 : 24}>
        {step !== 'passcode' && <Who user={user} />}

        {step === 'faceid' && (
          <Stack fill>
            {live
              ? <FaceScan key={attempt} attempt={attempt} failFirst={faceId === 'fails'} onResult={(ok) => (ok ? onUnlock?.() : setInnerStep('failed'))} />
              : <LockOverlay method="faceid" state="scanning" />}
          </Stack>
        )}

        {/* The way around Face ID is on screen while it scans, not only
            after it fails: a mask or gloves shouldn't mean waiting. */}
        {step === 'faceid' && (
          <Button variant="ghost" size="md" fullWidth onClick={() => setInnerStep('passcode')}>Use passcode</Button>
        )}

        {step === 'failed' && (
          <Stack fill>
            <LockOverlay
              method="faceid"
              state="failed"
              onRetry={scanAgain}
              onUseFallback={() => setInnerStep('passcode')}
              fallbackLabel="Use passcode"
            />
          </Stack>
        )}

        {step === 'passcode' && (
          <PasscodeEntry
            key={preset}
            expected={passcode}
            live={live}
            preset={preset}
            subtitle={`Signed in as ${user.email}`}
            hint={passcodeHint(passcode)}
            showBiometric
            onBiometric={scanAgain}
            onSuccess={onUnlock}
            onForgot={onForgot}
          />
        )}
      </Stack>
    </Screen>
  )
}

export { STEPS as UNLOCK_STEPS, CHECKS as UNLOCK_CHECKS }
