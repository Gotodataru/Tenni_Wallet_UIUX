import { useState } from 'react'
import { Text, Segmented, Button, Stack } from '../ui/index.js'
import { HomeScreen } from '../screens/HomeScreen.jsx'
import { PayScreen, PAY_STEPS } from '../screens/PayScreen.jsx'
import { OnboardingScreen, ONBOARDING_STEPS } from '../screens/OnboardingScreen.jsx'
import { SendScreen, SEND_STEPS } from '../screens/SendScreen.jsx'
import { ReceiveScreen, RECEIVE_ASSETS } from '../screens/ReceiveScreen.jsx'
import { ActivityScreen, ACTIVITY_FILTERS } from '../screens/ActivityScreen.jsx'
import { SettingsScreen, SETTINGS_STEPS } from '../screens/SettingsScreen.jsx'
import { Section, Spec, Cell } from './parts.jsx'

const HOME_STATES = ['default', 'loading', 'empty', 'error']

const LABEL = {
  welcome: 'Welcome', biometric: 'Biometrics', choice: 'Set up',
  request: 'Terminal request', confirm: 'Confirm', processing: 'Processing', success: 'Success', declined: 'Declined',
  address: 'Address', amount: 'Amount', review: 'Review',
  settings: 'Settings', profile: 'Profile',
}
const SEND_LABEL = { ...LABEL, confirm: 'Face ID', success: 'Sent' }

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
  return (
    <Section title="Onboarding" hint="Welcome → biometrics → create or import. The demo stops before the recovery phrase on purpose.">
      <Grid title="All steps" contract="Figma: one flow, arrows between frames">
        {ONBOARDING_STEPS.map((s) => (
          <Small key={s} label={LABEL[s]}><OnboardingScreen step={s} theme={theme} scaled /></Small>
        ))}
      </Grid>
    </Section>
  )
}

function HomeSection({ theme }) {
  const [bootKey, setBootKey] = useState(0)

  return (
    <Section title="Home" hint="Balance, the card with the Pay composer, quick actions, portfolio, activity.">
      <Spec title="Cold start with real timing" column>
        <Text variant="bodySm" tone="dim">
          900 ms of skeletons under every block, then content. Swap and Stake answer with a toast instead of doing nothing.
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
    <Section title="Pay" hint="Tap-to-pay charged in crypto. The terminal sends the amount; the user picks the asset and confirms.">
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
      <HomeSection theme={theme} />
      <PaySection theme={theme} />
      <SendSection theme={theme} />
      <ReceiveSection theme={theme} />
      <ActivitySection theme={theme} />
      <SettingsSection theme={theme} />
    </>
  )
}
