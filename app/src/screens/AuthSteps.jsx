import { useEffect, useRef, useState } from 'react'
import {
  Stack, Text, Input, Button, Checkbox, Keypad, PinDots, Toast, Banner,
} from '../ui/index.js'
import { emailError, passcodeWeakness, clock } from './format.js'
import { DEMO_CODE, DEMO_PASSCODE } from './data.js'

/**
 * Steps shared by sign-up, sign-in and unlock: email, the emailed code,
 * creating a passcode and typing it back.
 *
 * Every step checks its input the same way: nothing turns red while the
 * user is still typing; the check runs when they commit (Continue, the
 * sixth digit), and an error says what to do next, not only what is wrong.
 *
 * `preset` freezes a step in one state for the catalog (a wrong code, a
 * weak passcode…) — the live prototype never passes it.
 */

const PASSCODE_LENGTH = 6

const CODE_TRIES = 3
const PASSCODE_TRIES = 5
const RESEND_SECONDS = 30
const LOCKOUT_SECONDS = 30
const FLASH_MS = 650   // how long a wrong passcode stays red before the dots clear

/** The one sign-up email that already has an account (the demo user). */
const TAKEN_EMAIL = 'nina.ross@example.com'

/** A countdown that ticks once a second while `active`. */
function useCountdown(seconds, active) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (!active || left <= 0) return
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [active, left])
  return [left, setLeft]
}

/** One timer at a time, cleared on unmount — for the "flash red, then clear" beat. */
function useLater() {
  const ref = useRef()
  useEffect(() => () => clearTimeout(ref.current), [])
  return (fn, ms) => { clearTimeout(ref.current); ref.current = setTimeout(fn, ms) }
}

/* ── Email ─────────────────────────────────────────────────────── */

/**
 * mode — signup: asks for the terms and refuses an email that already has
 *        an account (with the way to sign in right there);
 *        signin: any well-formed email gets a code — telling a stranger
 *        which emails have accounts would leak who uses the app.
 */
export function EmailStep({ mode = 'signup', value, onChange, onNext, onSignIn, preset }) {
  const [error, setError] = useState(preset === 'invalid' ? emailError('nina@example') : null)
  const [taken, setTaken] = useState(preset === 'taken')
  const [agreed, setAgreed] = useState(preset === 'terms' ? false : mode !== 'signup')
  const [termsError, setTermsError] = useState(preset === 'terms')

  function submit() {
    const formatError = emailError(value)
    const isTaken = mode === 'signup' && value.trim().toLowerCase() === TAKEN_EMAIL
    setError(formatError)
    setTaken(!formatError && isTaken)
    setTermsError(!agreed)
    if (!formatError && !isTaken && agreed) onNext()
  }

  return (
    <Stack gap={24} fill>
      <Stack gap={4}>
        <Text variant="h2">{mode === 'signup' ? 'What’s your email?' : 'Welcome back'}</Text>
        <Text variant="bodySm" tone="dim">
          {mode === 'signup'
            ? 'We’ll send a code to confirm it’s yours.'
            : 'Enter the email you signed up with. We’ll send you a code.'}
        </Text>
      </Stack>

      <Stack gap={12}>
        <Input
          label="Email"
          placeholder="name@example.com"
          value={value}
          onChange={(v) => { onChange(v); setError(null); setTaken(false) }}
          error={error || (taken ? 'An account with this email already exists' : undefined)}
          hint="Demo: nothing you type leaves this page"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
        />
        {taken && (
          <Button variant="secondary" size="md" iconTrailing="arrow-right" onClick={onSignIn}>
            Sign in instead
          </Button>
        )}
      </Stack>

      {mode === 'signup' && (
        <Stack gap={6}>
          <Stack dir="row" gap={12} align="center">
            <Checkbox
              checked={agreed}
              state={termsError && !agreed ? 'error' : undefined}
              onChange={(v) => { setAgreed(v); setTermsError(false) }}
              aria-label="I agree to the Terms of Service and the Privacy Policy"
            />
            <Text variant="bodySm" tone="dim">I agree to the Terms of Service and the Privacy Policy</Text>
          </Stack>
          {termsError && !agreed && (
            <Text variant="bodySm" tone="danger">Accept the terms to open an account</Text>
          )}
        </Stack>
      )}

      <Stack fill justify="end">
        <Button
          variant="primary" size="xl" fullWidth iconTrailing="arrow-right"
          state={value.trim() ? undefined : 'disabled'} onClick={submit}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  )
}

/* ── The emailed code ──────────────────────────────────────────── */

const CODE_ERROR = {
  wrong: (left) => `That code doesn’t match. ${left} ${left === 1 ? 'try' : 'tries'} left`,
  locked: 'Too many wrong codes. Request a new one',
  expired: 'This code has expired. Request a new one',
}

/**
 * Six digits, checked the moment the sixth one lands — no extra button.
 * Three wrong tries lock the code; a new one can be requested after a
 * 30 s cooldown. The demo "inbox" is a notification at the top, so a
 * visitor has the code without leaving the page.
 */
export function CodeStep({ email, live = true, preset, onNext, onChangeEmail }) {
  const [code, setCode] = useState(preset ? (preset === 'wrong' ? '246801' : '') : '')
  const [tries, setTries] = useState(preset === 'wrong' ? 1 : preset === 'locked' ? CODE_TRIES : 0)
  const [expired, setExpired] = useState(preset === 'expired')
  const [done, setDone] = useState(false)
  const [resendIn, setResendIn] = useCountdown(preset === 'locked' || preset === 'expired' ? 0 : RESEND_SECONDS, live)
  const later = useLater()

  const locked = tries >= CODE_TRIES
  const error = expired ? CODE_ERROR.expired
    : locked ? CODE_ERROR.locked
    : tries > 0 && code.length === 6 ? CODE_ERROR.wrong(CODE_TRIES - tries)
    : undefined

  function type(v) {
    const digits = v.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    if (digits.length < 6 || locked || expired) return
    if (digits === DEMO_CODE) {
      setDone(true)
      later(onNext, 400)
    } else {
      setTries((t) => t + 1)
    }
  }

  function resend() {
    setCode(''); setTries(0); setExpired(false); setResendIn(RESEND_SECONDS)
  }

  return (
    <Stack gap={24} fill>
      <Toast tone="info" message={`Demo inbox · Your Tenni code is ${DEMO_CODE.slice(0, 3)} ${DEMO_CODE.slice(3)}`} />

      <Stack gap={4}>
        <Text variant="h2">Check your email</Text>
        <Text variant="bodySm" tone="dim">We sent a 6-digit code to {email || 'your email'}.</Text>
        <Stack dir="row">
          <Button variant="link" size="sm" onClick={onChangeEmail}>Change email</Button>
        </Stack>
      </Stack>

      <Input
        label="Code"
        placeholder="6 digits"
        value={code}
        onChange={type}
        state={done ? 'success' : locked || expired ? 'disabled' : undefined}
        error={error}
        hint={done ? 'Email confirmed' : 'It can take up to a minute to arrive'}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
      />

      <Stack fill justify="end" align="center">
        <Button
          variant={locked || expired ? 'primary' : 'ghost'}
          size={locked || expired ? 'xl' : 'md'}
          fullWidth
          iconLeading="refresh"
          state={resendIn > 0 ? 'disabled' : undefined}
          onClick={resend}
        >
          {resendIn > 0 ? `Send a new code in ${clock(resendIn)}` : 'Send a new code'}
        </Button>
      </Stack>
    </Stack>
  )
}

/* ── Passcode: the shared pad ──────────────────────────────────── */

/**
 * Title, dots, one line for the error and the keypad. The error line
 * keeps its height when empty, so the keypad never jumps when it appears.
 */
function PasscodePad({ title, subtitle, filled, dots = 'default', message, messageTone = 'danger', keypad = true, showBiometric = false, onKey, onBackspace, onBiometric, footer }) {
  return (
    <Stack gap={24} fill justify="between">
      <Stack gap={24} align="center" fill justify="center">
        <Stack gap={4} align="center">
          <Text variant="h2" align="center">{title}</Text>
          {subtitle && <Text variant="bodySm" tone="dim" align="center">{subtitle}</Text>}
        </Stack>
        <PinDots length={PASSCODE_LENGTH} filled={filled} state={dots} />
        <Text variant="bodySm" tone={messageTone} align="center">{message || ' '}</Text>
      </Stack>

      <Stack gap={12}>
        {keypad && (
          <Keypad mode="pin" showBiometric={showBiometric} onKey={onKey} onBackspace={onBackspace} onBiometric={onBiometric} />
        )}
        {footer}
      </Stack>
    </Stack>
  )
}

/* ── Passcode: create + confirm ────────────────────────────────── */

/**
 * The obvious codes are refused before they are saved (see
 * passcodeWeakness), and the second entry must match the first. A
 * mismatch starts over from the first entry — the user can't know which
 * of the two was the typo.
 *
 * phase — create | confirm; set from outside only in the catalog.
 */
export function PasscodeCreate({ phase: phaseProp, preset, onDone }) {
  const [innerPhase, setPhase] = useState('create')
  const [first, setFirst] = useState('')
  const [code, setCode] = useState(preset ? '111111' : '')
  const [dots, setDots] = useState(preset ? 'error' : 'default')
  const [message, setMessage] = useState(
    preset === 'weak' ? passcodeWeakness('111111')
    : preset === 'mismatch' ? 'The passcodes didn’t match. Create it again'
    : null,
  )
  const later = useLater()
  const phase = phaseProp || innerPhase
  const busy = dots !== 'default'

  function key(k) {
    if (busy || code.length >= PASSCODE_LENGTH) return
    const next = code + k
    setCode(next)
    setMessage(null)
    if (next.length < PASSCODE_LENGTH) return

    if (phase === 'create') {
      const weak = passcodeWeakness(next)
      if (weak) {
        setDots('error'); setMessage(weak)
        later(() => { setCode(''); setDots('default') }, FLASH_MS)
      } else {
        later(() => { setFirst(next); setCode(''); setPhase('confirm') }, 200)
      }
    } else if (next === first) {
      setDots('success')
      later(() => onDone?.(next), 400)
    } else {
      setDots('error'); setMessage('The passcodes didn’t match. Create it again')
      later(() => { setCode(''); setFirst(''); setDots('default'); setPhase('create') }, FLASH_MS)
    }
  }

  const back = () => { if (!busy) setCode((c) => c.slice(0, -1)) }

  return (
    <PasscodePad
      title={phase === 'create' ? 'Create a passcode' : 'Repeat your passcode'}
      subtitle={phase === 'create'
        ? '6 digits. It unlocks the app when Face ID can’t'
        : 'Type the same 6 digits again'}
      filled={code.length}
      dots={dots}
      message={message}
      onKey={key}
      onBackspace={back}
    />
  )
}

/* ── Passcode: enter (unlock, sign-in) ─────────────────────────── */

/**
 * Five wrong tries lock the pad for 30 s — long enough to stop guessing,
 * short enough not to lock a real owner out. "Forgot passcode?" is always
 * on screen, the lockout included: that is exactly when it's needed.
 *
 * preset — wrong | locked (catalog only).
 */
export function PasscodeEntry({ expected = DEMO_PASSCODE, live = true, preset, title = 'Enter your passcode', subtitle, hint, showBiometric = false, onBiometric, onSuccess, onForgot }) {
  const [code, setCode] = useState(preset === 'wrong' ? '000000' : '')
  const [tries, setTries] = useState(preset === 'wrong' ? 2 : preset === 'locked' ? PASSCODE_TRIES : 0)
  const [dots, setDots] = useState(preset === 'wrong' ? 'error' : 'default')
  const locked = tries >= PASSCODE_TRIES
  const [lockLeft, setLockLeft] = useCountdown(LOCKOUT_SECONDS, live && locked)
  const later = useLater()
  const busy = dots !== 'default'

  // The lockout is over: one more round of tries.
  if (locked && lockLeft <= 0) {
    setTries(0)
    setLockLeft(LOCKOUT_SECONDS)
  }

  function key(k) {
    if (busy || locked || code.length >= PASSCODE_LENGTH) return
    const next = code + k
    setCode(next)
    if (next.length < PASSCODE_LENGTH) return

    if (next === expected) {
      setDots('success')
      later(() => onSuccess?.(), 350)
    } else {
      setDots('error')
      setTries((t) => t + 1)
      later(() => { setCode(''); setDots('default') }, FLASH_MS)
    }
  }

  const left = PASSCODE_TRIES - tries
  const message = locked ? null
    : tries > 0 ? `Wrong passcode. ${left} ${left === 1 ? 'try' : 'tries'} left`
    : hint
  const back = () => { if (!busy) setCode((c) => c.slice(0, -1)) }

  return (
    <PasscodePad
      title={title}
      subtitle={subtitle}
      filled={locked ? 0 : code.length}
      dots={dots}
      message={message}
      messageTone={tries > 0 ? 'danger' : 'dim'}
      keypad={!locked}
      showBiometric={showBiometric}
      onKey={key}
      onBackspace={back}
      onBiometric={onBiometric}
      footer={(
        <Stack gap={12}>
          {locked && (
            <Banner
              tone="warning"
              title={`Try again in ${clock(lockLeft)}`}
              body="Too many wrong passcodes. The pad is paused so nobody can guess it"
            />
          )}
          <Button variant="ghost" size="md" fullWidth onClick={onForgot}>Forgot passcode?</Button>
        </Stack>
      )}
    />
  )
}
