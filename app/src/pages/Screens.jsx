import { useState } from 'react'
import { Text, Segmented, Button, Stack } from '../ui/index.js'
import { HomeScreen } from '../screens/HomeScreen.jsx'
import { PayScreen, PAY_STEPS } from '../screens/PayScreen.jsx'
import { OnboardingScreen, ONBOARDING_STEPS, ONBOARDING_CHECKS } from '../screens/OnboardingScreen.jsx'
import { SignInScreen, SIGNIN_STEPS } from '../screens/SignInScreen.jsx'
import { UnlockScreen, UNLOCK_STEPS, UNLOCK_CHECKS } from '../screens/UnlockScreen.jsx'
import { VerifyScreen, VERIFY_STEPS, VERIFY_CHECKS } from '../screens/VerifyScreen.jsx'
import { CardScreen, CARD_STEPS, CARD_CHECKS } from '../screens/CardScreen.jsx'
import { SendScreen, SEND_STEPS } from '../screens/SendScreen.jsx'
import { ReceiveScreen, RECEIVE_ASSETS } from '../screens/ReceiveScreen.jsx'
import { ActivityScreen, ACTIVITY_FILTERS } from '../screens/ActivityScreen.jsx'
import { SettingsScreen, SETTINGS_STEPS } from '../screens/SettingsScreen.jsx'
import { Section, Spec, Cell } from './parts.jsx'

const HOME_STATES = ['default', 'loading', 'empty', 'error']

const LABEL = {
  welcome: 'Welcome', email: 'Email', code: 'Code', passcode: 'Passcode', biometric: 'Biometrics', choice: 'Set up', backup: 'Backup',
  reset: 'New passcode', faceid: 'Face ID', failed: 'Face ID failed',
  intro: 'Intro', country: 'Country', details: 'Details', document: 'ID photo', selfie: 'Selfie', checking: 'Checking', approved: 'Card ready', retry: 'Retake',
  main: 'Card', limits: 'Limit', lost: 'Lost or stolen', replaced: 'Replaced',
  ready: 'Pick the coin', hold: 'Hold near reader', confirm: 'Confirm', processing: 'Terminal answers', success: 'Paid', declined: 'Declined',
  address: 'Address', amount: 'Amount', review: 'Review',
  settings: 'Settings', profile: 'Profile',
}
const SEND_LABEL = { ...LABEL, confirm: 'Face ID', success: 'Sent' }
const ONBOARDING_LABEL = { ...LABEL, confirm: 'Repeat passcode' }
const CARD_LABEL = { ...LABEL, details: 'Details (Face ID)' }

/** Every check a flow makes, frozen in its error state. */
function Checks({ checks, render }) {
  return (
    <Grid title="Validation" contract="every check the flow makes, in its error state">
      {checks.map((c) => (
        <Small key={c.id} label={c.label}>{render(c)}</Small>
      ))}
    </Grid>
  )
}

/** A live flow with its outcome picked on a Segmented, like Pay, and a replay. */
function Live({ title, items, value, onChange, onReplay, children }) {
  return (
    <Spec title={title} column>
      {items && (
        <div style={{ maxWidth: 360 }}>
          <Segmented items={items.map((i) => i.label)} active={items.findIndex((i) => i.id === value)} onChange={(i) => onChange(items[i].id)} />
        </div>
      )}
      {onReplay && (
        <Stack dir="row" gap={12}>
          <Button variant="secondary" size="sm" iconLeading="refresh" onClick={onReplay}>Replay</Button>
        </Stack>
      )}
      <div className="Device">{children}</div>
    </Spec>
  )
}

function Grid({ title, contract, children }) {
  return <Spec title={title} contract={contract}>{children}</Spec>
}

function Small({ label, children }) {
  return (
    <Cell label={label} center>
      <div className="Device--sm">{children}</div>
    </Cell>
  )
}

function OnboardingSection({ theme }) {
  const [run, setRun] = useState(0)
  return (
    <Section title="Onboarding · sign-up" hint="Welcome → email → code → passcode → biometrics → create or import → backup. The new wallet is backed up with a passkey; no screen shows or asks for a recovery phrase.">
      <Live title="Live flow">
        <OnboardingScreen key={run} theme={theme} onFinish={() => setRun((r) => r + 1)} onSignIn={() => setRun((r) => r + 1)} />
      </Live>
      <Grid title="All steps" contract="Figma: one flow, arrows between frames">
        {ONBOARDING_STEPS.map((s) => (
          <Small key={s} label={ONBOARDING_LABEL[s]}><OnboardingScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
      <Checks checks={ONBOARDING_CHECKS} render={(c) => <OnboardingScreen step={c.step} preset={c.preset} theme={theme} scaled />} />
    </Section>
  )
}

function SignInSection({ theme }) {
  return (
    <Section title="Sign in" hint="A returning user on a new phone: email → code → passcode. Forgot the passcode? The email was just confirmed, so a new one is set right there.">
      <Grid title="All steps">
        {SIGNIN_STEPS.map((s) => (
          <Small key={s} label={LABEL[s]}><SignInScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
    </Section>
  )
}

function UnlockSection({ theme }) {
  const outcomes = [{ id: 'works', label: 'Face ID works' }, { id: 'fails', label: 'Not recognized' }]
  const [faceId, setFaceId] = useState('fails')
  const [run, setRun] = useState(0)
  const replay = () => setRun((r) => r + 1)
  return (
    <Section title="Unlock" hint="The app comes back from the background: Face ID first, the passcode when Face ID can’t. In the prototype Face ID just works; the failure is here. Five wrong passcodes pause the pad for 30 s.">
      <Live title="Live flow: try both outcomes" items={outcomes} value={faceId} onChange={(o) => { setFaceId(o); replay() }} onReplay={replay}>
        <UnlockScreen key={`${faceId}-${run}`} faceId={faceId} theme={theme} onForgot={replay} />
      </Live>
      <Grid title="All steps">
        {UNLOCK_STEPS.map((s) => (
          <Small key={s} label={LABEL[s]}><UnlockScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
      <Checks checks={UNLOCK_CHECKS} render={(c) => <UnlockScreen step={c.step} preset={c.preset} theme={theme} scaled />} />
    </Section>
  )
}

function VerifySection({ theme }) {
  const outcomes = [{ id: 'approved', label: 'Approved' }, { id: 'glare', label: 'Glare on the ID' }, { id: 'retry', label: 'Blurry ID' }]
  const [outcome, setOutcome] = useState('approved')
  const [run, setRun] = useState(0)
  return (
    <Section title="Verify identity" hint="The check a card issuer must run, then the card. Why first, refuse early (country, age), and a retry asks again only for the one photo that failed. In the prototype every step passes; the failures are picked here.">
      <Live title="Live flow: try every outcome" items={outcomes} value={outcome} onChange={(o) => { setOutcome(o); setRun((r) => r + 1) }}>
        <VerifyScreen key={`${outcome}-${run}`} outcome={outcome} theme={theme} onFinish={() => setRun((r) => r + 1)} onExit={() => setRun((r) => r + 1)} />
      </Live>
      <Grid title="All steps">
        {VERIFY_STEPS.map((s) => (
          <Small key={s} label={LABEL[s]}><VerifyScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
      <Checks checks={VERIFY_CHECKS} render={(c) => <VerifyScreen step={c.step} preset={c.preset} theme={theme} scaled />} />
    </Section>
  )
}

function CardSection({ theme }) {
  const [run, setRun] = useState(0)
  return (
    <Section title="Card" hint="Freeze, details behind Face ID, a daily limit, lost or stolen. Each action is sized to its risk: freezing is one toggle, raising a limit past $5,000 asks for Face ID, blocking offers Freeze instead.">
      <Live title="Live flow">
        <CardScreen key={run} theme={theme} onExit={() => setRun((r) => r + 1)} />
      </Live>
      <Grid title="All steps">
        {CARD_STEPS.map((s) => (
          <Small key={s} label={CARD_LABEL[s]}><CardScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
      <Checks checks={CARD_CHECKS} render={(c) => <CardScreen step={c.step} preset={c.preset} theme={theme} scaled />} />
    </Section>
  )
}

function HomeSection({ theme }) {
  const [bootKey, setBootKey] = useState(0)

  return (
    <Section title="Home" hint="Balance with the week's change, the card with the Pay with row, quick actions, activity.">
      <Spec title="Cold start with real timing" column>
        <Text variant="bodySm" tone="dim">
          900 ms of skeletons under every block, then content. The … tile opens a sheet with Swap and Stake, marked Soon.
        </Text>
        <Stack dir="row" gap={12}>
          <Button variant="secondary" size="sm" iconLeading="refresh" onClick={() => setBootKey((k) => k + 1)}>Replay</Button>
        </Stack>
        <div className="Device">
          <HomeScreen key={bootKey} theme={theme} />
        </div>
      </Spec>

      <Grid title="All four states" contract="default · loading · empty · error">
        {HOME_STATES.map((s) => (
          <Small key={s} label={s}><HomeScreen state={s} theme={theme} scaled /></Small>
        ))}
      </Grid>

      <Grid title="Both themes" contract="these two ignore the page theme switch on purpose">
        <Small label="light"><HomeScreen state="default" theme="light" scaled /></Small>
        <Small label="dark"><HomeScreen state="default" theme="dark" scaled /></Small>
      </Grid>
    </Section>
  )
}

function PaySection({ theme }) {
  const outcomes = ['success', 'declined']
  const [outcome, setOutcome] = useState('success')

  return (
    <Section title="Pay" hint="Tap the phone at a terminal, charged in crypto. The coin is picked before the tap (with a backup), Face ID arms the phone, the terminal sets the amount after the tap. The breakdown comes with the result.">
      <Spec title="Live flow: try both outcomes" column>
        <div style={{ maxWidth: 320 }}>
          <Segmented items={['Approved', 'Declined']} active={outcomes.indexOf(outcome)} onChange={(i) => setOutcome(outcomes[i])} />
        </div>
        <div className="Device">
          <PayScreen key={outcome} outcome={outcome} theme={theme} />
        </div>
      </Spec>

      <Grid title="All steps">
        {PAY_STEPS.map((s) => (
          <Small key={s} label={LABEL[s]}><PayScreen step={s} theme={theme} scaled /></Small>
        ))}
        <Small label="Card frozen"><PayScreen step="ready" frozen theme={theme} scaled /></Small>
      </Grid>
    </Section>
  )
}

function SendSection({ theme }) {
  return (
    <Section title="Send" hint="Address → amount → review → Face ID → sent. Address format and network are checked; Max leaves room for the fee; review shows the full address.">
      <Grid title="All steps">
        {SEND_STEPS.map((s) => (
          <Small key={s} label={SEND_LABEL[s]}><SendScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
    </Section>
  )
}

function ReceiveSection({ theme }) {
  return (
    <Section title="Receive" hint="QR, the full address in one place, copy and share, and a warning that names the exact network.">
      <Grid title="Every asset">
        {RECEIVE_ASSETS.map((a) => (
          <Small key={a.symbol} label={a.name}><ReceiveScreen asset={a.symbol} theme={theme} scaled /></Small>
        ))}
      </Grid>
    </Section>
  )
}

function ActivitySection({ theme }) {
  return (
    <Section title="Activity" hint="Search, a type filter and grouping by day, newest first. Pending and failed transactions have their own state.">
      <Grid title="Every filter">
        {ACTIVITY_FILTERS.map((f) => (
          <Small key={f.id} label={f.label}><ActivityScreen filter={f.id} theme={theme} scaled /></Small>
        ))}
      </Grid>
    </Section>
  )
}

function SettingsSection({ theme }) {
  return (
    <Section title="Settings + Profile" hint="Lists on ListRow with toggles. The Dark theme toggle is live: it switches the screen (and, in the prototype, the whole app).">
      <Grid title="Both steps">
        {SETTINGS_STEPS.map((s) => (
          <Small key={`${s}-${theme}`} label={LABEL[s]}><SettingsScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
    </Section>
  )
}

export function Screens({ theme }) {
  return (
    <>
      <Section hint="Every screen of the prototype in every state. The screens are assembled only from system components. There is no screen-level CSS.">
        <Stack dir="row" gap={8} wrap>
          <a className="CaseLink CaseLink--primary" href="#case">Open the clickable prototype</a>
        </Stack>
      </Section>
      <OnboardingSection theme={theme} />
      <SignInSection theme={theme} />
      <UnlockSection theme={theme} />
      <VerifySection theme={theme} />
      <HomeSection theme={theme} />
      <CardSection theme={theme} />
      <PaySection theme={theme} />
      <SendSection theme={theme} />
      <ReceiveSection theme={theme} />
      <ActivitySection theme={theme} />
      <SettingsSection theme={theme} />
    </>
  )
}
