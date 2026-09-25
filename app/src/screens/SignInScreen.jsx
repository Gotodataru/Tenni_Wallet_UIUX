import { useState } from 'react'
import { Screen, AppBar, IconButton, Stack, ProgressDots } from '../ui/index.js'
import { USER, DEMO_PASSCODE, passcodeHint } from './data.js'
import { EmailStep, CodeStep, PasscodeEntry, PasscodeCreate } from './AuthSteps.jsx'

/**
 * Sign in on a phone the app doesn't know yet — email → code → passcode.
 *
 * The emailed code proves the inbox; the passcode proves the person.
 * "Forgot passcode?" doesn't send the user anywhere new: the email was
 * just confirmed, so they set a new passcode right here.
 *
 * reset — came from "Forgot passcode?" on Unlock: the email is known,
 *         and after the code the user goes straight to a new passcode.
 */

const STEPS = ['email', 'code', 'passcode', 'reset']

const DOT = { email: 0, code: 1, passcode: 2, reset: 2 }

export function SignInScreen({ step: stepProp, reset = false, passcode = DEMO_PASSCODE, theme = 'dark', scaled = false, onFinish, onExit, onPasscode }) {
  const [innerStep, setInnerStep] = useState(reset ? 'code' : 'email')
  const [email, setEmail] = useState(reset || stepProp ? USER.email : '')
  const step = stepProp || innerStep
  const live = !stepProp

  const go = (s) => { if (live) setInnerStep(s) }
  const back = { code: reset ? undefined : 'email', reset: reset ? undefined : 'passcode' }[step]

  const appBar = (
    <AppBar
      title={reset ? 'Reset passcode' : 'Sign in'}
      layout="title-center"
      onBack={back && live ? () => go(back) : undefined}
      leading={!back ? <IconButton variant="ghost" size={32} icon="close" aria-label="Close" onClick={onExit} /> : undefined}
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
        <Stack align="center">
          <ProgressDots total={3} active={DOT[step]} />
        </Stack>

        {step === 'email' && (
          <EmailStep mode="signin" value={email} onChange={setEmail} onNext={() => go('code')} />
        )}

        {step === 'code' && (
          <CodeStep email={email} live={live} onNext={() => go(reset ? 'reset' : 'passcode')} onChangeEmail={() => go('email')} />
        )}

        {step === 'passcode' && (
          <PasscodeEntry
            expected={passcode}
            live={live}
            hint={passcodeHint(passcode)}
            onSuccess={onFinish}
            onForgot={() => go('reset')}
          />
        )}

        {step === 'reset' && (
          <PasscodeCreate onDone={(code) => { onPasscode?.(code); onFinish?.() }} />
        )}
      </Stack>
    </Screen>
  )
}

export { STEPS as SIGNIN_STEPS }
