import { Stack, Text, Icon } from '../ui/index.js'
import { PrototypeApp } from '../screens/PrototypeApp.jsx'
import { HomeScreen } from '../screens/HomeScreen.jsx'
import { PayScreen } from '../screens/PayScreen.jsx'
import { SendScreen } from '../screens/SendScreen.jsx'
import { ReceiveScreen } from '../screens/ReceiveScreen.jsx'
import { ICON_NAMES } from '../icons/paths.js'
import { Section, Spec, Cell } from './parts.jsx'

const REPO = 'https://github.com/Gotodataru/Tenni_Wallet_UIUX'

const FACTS = [
  ['Product', 'Crypto wallet with a debit card'],
  ['Platform', 'iOS, 390 × 844'],
  ['Scope', 'UX flows · UI · design system · coded prototype'],
  ['System', `42 components · ${ICON_NAMES.length} icons · 2 themes`],
]

const TRY = [
  'Tap Pay on the card — the terminal sends the amount, you pick the asset',
  'Send → type anything into the address field, then paste an Ethereum address',
  'Send → Max: it leaves room for the network fee',
  'More → Dark theme switches the whole prototype',
  'More → Log out walks you through onboarding and back',
]

const DECISIONS = [
  {
    title: 'The terminal sets the amount, not the user',
    body: 'Paying at a card terminal starts with the merchant\'s request: amount in local currency, its dollar value, and one choice — which asset to pay with. The conversion fee is included in what gets charged, so the crypto amount matches the total on every step.',
    screen: <PayScreen step="request" scaled />,
    label: 'Pay · terminal request',
  },
  {
    title: 'Every money-losing mistake has a guard',
    body: 'The address field checks the format and catches an address from another network before you can continue. The review step shows the full address grouped by four characters — never truncated in the middle. Max sends the balance minus the fee, and the amount check always includes the fee.',
    screen: <SendScreen step="review" scaled />,
    label: 'Send · review',
  },
  {
    title: 'Color means something, and never alone',
    body: 'A night match under floodlights: a black canvas, the card in the electric cobalt of a hard court, and the optic-yellow ball as the only accent — actions and "up". Clay is "down" and errors; everyday spending stays neutral and every change carries an ▲/▼ arrow. On paper the ball is 1.2:1, so in the light theme actions turn ink and the ball becomes a highlight fill.',
    screen: <HomeScreen state="default" theme="light" scaled />,
    label: 'Home · light theme',
  },
  {
    title: 'The address is shown once, in full',
    body: 'Receive shows the address in one place only — the QR caption is off, so there is no second, truncated copy to compare against. The network warning names the exact network, because a wrong-network transfer is unrecoverable.',
    screen: <ReceiveScreen asset="usdt" scaled />,
    label: 'Receive · Tether (TRC-20)',
  },
]

const STATES = [
  'Home: loading skeletons under every block, empty, and error with retry',
  'Pay: processing, success, declined with two ways out',
  'Send: invalid and wrong-network address, not enough funds',
  'Activity: pending and failed transactions, nothing found',
  'Onboarding: a clear stop before the recovery phrase — a public demo never asks for one',
]

const NEXT = [
  'Usability test of the Pay flow with 5 people who already hold crypto',
  'Figma library: the layout already follows Auto Layout rules, so import is rename-and-combine, not redraw',
  'Swap and staking flows — the entry points exist, the flows don\'t yet',
]

function Bullets({ items, icon = 'check' }) {
  return (
    <Stack gap={8}>
      {items.map((t) => (
        <Stack key={t} dir="row" gap={12} align="start">
          <Icon name={icon} size={20} tone="accent" />
          <Text variant="body" tone="dim" fill>{t}</Text>
        </Stack>
      ))}
    </Stack>
  )
}

export function Case({ theme }) {
  return (
    <>
      <Section>
        <Stack gap={16}>
          <Stack gap={0}>
            <Text variant="display">Your card. Your coins.</Text>
            <Text variant="display" tone="accent">One wallet.</Text>
          </Stack>
          <Text variant="body" tone="dim">
            Tenni is a concept wallet for people who keep their money in crypto but spend it in the
            real world: tap the card at any terminal and pay from your crypto balance, send and
            receive without fear of a wrong address. Hypothesis: the hard part isn't buying crypto,
            it's spending it safely and without mental math.
          </Text>
          <Stack dir="row" gap={8} wrap>
            <a className="CaseLink CaseLink--primary" href="#screens">All screens and states</a>
            <a className="CaseLink" href="#tokens">Design system</a>
            <a className="CaseLink" href="landing/">Landing page</a>
            <a className="CaseLink" href={REPO} target="_blank" rel="noreferrer">Source on GitHub</a>
          </Stack>
        </Stack>

        <Spec title="At a glance" column>
          <Stack dir="row" gap={24} wrap>
            {FACTS.map(([k, v]) => (
              <Stack key={k} gap={2}>
                <Text variant="caption" tone="dim">{k}</Text>
                <Text variant="label">{v}</Text>
              </Stack>
            ))}
          </Stack>
        </Spec>
      </Section>

      <Section title="Clickable prototype" hint="All seven screens wired into one app. It runs right here — no Figma, no install.">
        <Spec title="Try this">
          <div className="Device">
            <PrototypeApp theme={theme} />
          </div>
          <Stack gap={12} className="CaseText">
            <Bullets items={TRY} icon="arrow-right" />
          </Stack>
        </Spec>
      </Section>

      <Section title="Key decisions">
        {DECISIONS.map((d) => (
          <Spec key={d.title} title={d.title}>
            <Cell label={d.label} center>
              <div className="Device--sm">{d.screen}</div>
            </Cell>
            <Stack gap={8} className="CaseText">
              <Text variant="body" tone="dim">{d.body}</Text>
            </Stack>
          </Spec>
        ))}
      </Section>

      <Section title="States, not just happy paths">
        <Spec title="Every flow is designed through its failures" column>
          <Bullets items={STATES} />
        </Spec>
      </Section>

      <Section title="Built to hand off">
        <Spec title="The code is the spec" column>
          <Text variant="body" tone="dim">
            Components are laid out with the subset of CSS that maps one-to-one to Figma Auto Layout:
            flex, gap and padding only — no margins, no percentages, no grid. A linter enforces it on
            every build, and every component documents its sizing contract (hug / fill / fixed) the way
            a designer sets it in Figma.
          </Text>
        </Spec>
      </Section>

      <Section title="What's next">
        <Spec title="Open questions" column>
          <Bullets items={NEXT} icon="clock" />
        </Spec>
      </Section>
    </>
  )
}
