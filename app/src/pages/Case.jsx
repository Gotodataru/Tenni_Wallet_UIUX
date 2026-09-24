import { Stack, Text, Icon } from '../ui/index.js'
import { PrototypeApp } from '../screens/PrototypeApp.jsx'
import { HomeScreen } from '../screens/HomeScreen.jsx'
import { PayScreen } from '../screens/PayScreen.jsx'
import { SendScreen } from '../screens/SendScreen.jsx'
import { ReceiveScreen } from '../screens/ReceiveScreen.jsx'
import { ICON_NAMES } from '../icons/paths.js'
import { Section, Spec, Cell } from './parts.jsx'
import homeBefore from '../assets/case/home-before.webp'
import homeAfter from '../assets/case/home-after.webp'

const REPO = 'https://github.com/Gotodataru/Tenni_Wallet_UIUX'
const FIGMA = 'https://www.figma.com/design/0ZzLBKXtXVnVgLirNT7KtM/Tenni-Wallet-Design-System'
const FIGMA_PROTO = 'https://www.figma.com/proto/0ZzLBKXtXVnVgLirNT7KtM/Tenni-Wallet-Design-System?node-id=20-3577&starting-point-node-id=20%3A3577'
const RESEARCH = `${REPO}/blob/master/research/README.md`

const TLDR = [
  ['Problem', 'Crypto is easy to buy and hard to spend: paying at a till means mental math, and a wrong address loses the money for good.'],
  ['What I did', 'Pay and Send flows designed through their failures, a design system in code, and its Figma counterpart: 33 components on variables, 20 screens and a prototype with 4 flows.'],
  ['What is proven', 'Not yet with people. A 5-person test with thresholds set in advance is written and runs next.'],
]

const FACTS = [
  ['Product', 'Crypto wallet with a debit card'],
  ['Platform', 'iOS, 390 × 844'],
  ['Scope', 'UX flows · UI · design system · coded prototype'],
  ['System', `43 components · ${ICON_NAMES.length} icons · 2 themes`],
]

const TRY = [
  'Tap Pay on the card. The terminal sends the amount, you pick the asset',
  'Send → type anything into the address field, then paste an Ethereum address',
  'Send → Max: it leaves room for the network fee',
  'More → Dark theme switches the whole prototype',
  'More → Log out walks you through onboarding and back',
]

/**
 * previews(theme) — the screens follow the page theme, like the prototype
 * above them. The palette decision is the exception: its text compares the
 * two themes, so it always shows both, side by side and labeled.
 */
const DECISIONS = [
  {
    title: 'The terminal sets the amount, not the user',
    body: 'Paying at a card terminal starts with the merchant\'s request: amount in local currency, its dollar value, and one choice: which asset to pay with. The conversion fee is included in what gets charged, so the crypto amount matches the total on every step.',
    previews: (theme) => [{ label: 'Pay · terminal request', screen: <PayScreen step="request" theme={theme} scaled /> }],
  },
  {
    title: 'Every money-losing mistake has a guard',
    body: 'The address field checks the format and catches an address from another network before you can continue. The review step shows the full address grouped by four characters and never truncated in the middle. Max sends the balance minus the fee, and the amount check always includes the fee.',
    previews: (theme) => [{ label: 'Send · review', screen: <SendScreen step="review" theme={theme} scaled /> }],
  },
  {
    title: 'Color means something, and never alone',
    body: 'A tennis ball on a neutral court: graphite and paper are the surfaces, the lime ball is the card, the primary action and "up", clay is "down" and errors. The ball is the only color on the screen, so it always means something. Everyday spending stays neutral and every change carries an ▲/▼ arrow. Lime on paper is 1.2:1, so in the light theme ink takes the accent role and "up" is the ball darkened to olive.',
    previews: () => [
      { label: 'Home · dark theme', screen: <HomeScreen state="default" theme="dark" scaled /> },
      { label: 'Home · light theme', screen: <HomeScreen state="default" theme="light" scaled /> },
    ],
  },
  {
    title: 'The address is shown once, in full',
    body: 'Receive shows the address in one place only. The QR caption is off, so there is no second, truncated copy to compare against. The network warning names the exact network, because a wrong-network transfer is unrecoverable.',
    previews: (theme) => [{ label: 'Receive · Tether (TRC-20)', screen: <ReceiveScreen asset="usdt" theme={theme} scaled /> }],
  },
]

const STATES = [
  'Home: loading skeletons under every block, empty, and error with retry',
  'Pay: processing, success, declined with two ways out',
  'Send: invalid and wrong-network address, not enough funds',
  'Activity: pending and failed transactions, nothing found',
  'Onboarding: a clear stop before the recovery phrase, since a public demo never asks for one',
]

const NEXT = [
  'Usability test with 5 people: the protocol and its thresholds are written, the sessions are next',
  'Swap and staking flows: the entry points exist, the flows don\'t yet',
]

/** What a design review changed — the iteration, told plainly. */
const REVIEW = [
  ['Everything was green', 'Background, surfaces, card and chart were all tinted green, so the lime accent had nothing to stand out against. The base is now neutral graphite and the ball color lives in a few places only.'],
  ['The card didn\'t read as a card', 'A near-square glass panel with blurred color blobs and a second card peeking out with clipped text. Now it is one card in real ISO proportions, with the tennis ball\'s seam as its only print.'],
  ['Every label shouted', 'About a dozen uppercase labels on one screen flattened the hierarchy. Labels are sentence case now; size and weight carry the order.'],
  ['Boxes in boxes', 'Every group had a 1px frame, inside another frame. Groups now separate by spacing and a tone step.'],
  ['All actions looked equal', 'Four identical circles for Send, Receive, Swap and Stake. The two everyday actions are wide tiles now, the rest sit under More.'],
  ['The same number three times', '+3.84% appeared under the balance, in a chip and in a portfolio chart. It stays once, in the balance line.'],
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

function scrollToPrototype() {
  document.getElementById('prototype')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Case({ theme }) {
  return (
    <>
      <Section>
        {/* Hero: the product first, the words second — a recruiter decides
            in seconds, so the card has to be on screen before any text. */}
        <div className="CaseHero">
          <Stack gap={20} className="CaseHero__copy">
            <Stack gap={0}>
              <Text variant="display">Your card. Your coins.</Text>
              <Text variant="display" tone="accent">One wallet.</Text>
            </Stack>
            <Text variant="body" tone="dim">
              A concept wallet for people who keep their money in crypto but spend it in the real
              world. Tap the card, pick the coin, pay, with no mental math and no fear of a wrong address.
            </Text>
            <Stack dir="row" gap={8} wrap>
              <button type="button" className="CaseLink CaseLink--primary" onClick={scrollToPrototype}>Try the prototype</button>
              <a className="CaseLink" href="#screens">All screens and states</a>
            </Stack>
          </Stack>
          <div className="CaseHero__phones" aria-hidden="true">
            <div className="Device--hero"><div className="Device__hero"><HomeScreen state="default" theme={theme} /></div></div>
            <div className="Device--hero CaseHero__second"><div className="Device__hero"><PayScreen step="success" theme={theme} /></div></div>
          </div>
        </div>

        <Stack dir="row" gap={8} wrap>
          <a className="CaseLink" href="#tokens">Design system</a>
          <a className="CaseLink" href={FIGMA} target="_blank" rel="noreferrer">View in Figma</a>
          <a className="CaseLink" href={FIGMA_PROTO} target="_blank" rel="noreferrer">Figma prototype</a>
          <a className="CaseLink" href={RESEARCH} target="_blank" rel="noreferrer">Test protocol</a>
          <a className="CaseLink" href="landing/">Landing page</a>
          <a className="CaseLink" href={REPO} target="_blank" rel="noreferrer">Source on GitHub</a>
        </Stack>

        <Spec title="In short" column>
          <Stack gap={12}>
            {TLDR.map(([k, v]) => (
              <Stack key={k} gap={2}>
                <Text variant="caption" tone="dim">{k}</Text>
                <Text variant="body">{v}</Text>
              </Stack>
            ))}
          </Stack>
        </Spec>

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

      <Section id="prototype" title="Clickable prototype" hint="All seven screens wired into one app. It runs right here, no Figma and no install.">
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
            {d.previews(theme).map(({ label, screen }) => (
              <Cell key={label} label={label} center>
                <div className="Device--sm">{screen}</div>
              </Cell>
            ))}
            <Stack gap={8} className="CaseText">
              <Text variant="body" tone="dim">{d.body}</Text>
            </Stack>
          </Spec>
        ))}
      </Section>

      <Section title="Iteration after a design review" hint="A designer looked at the first version and called it cheap. The flows held up; the visuals didn't. This is what was wrong and what changed.">
        <Spec title="Home, before and after">
          <Cell label="Before" center>
            <img className="CaseShot" src={homeBefore} width="390" height="844" alt="The first version of Home: green-tinted background, a glass panel over a blurred card, four round action buttons, uppercase labels" />
          </Cell>
          <Cell label="After" center>
            <img className="CaseShot" src={homeAfter} width="390" height="844" alt="The redesigned Home: neutral graphite background, a tennis-ball colored card with its seam, a Pay with row, Send and Receive tiles" />
          </Cell>
          <Stack gap={16} className="CaseText">
            {REVIEW.map(([k, v]) => (
              <Stack key={k} gap={2}>
                <Text variant="title">{k}</Text>
                <Text variant="body" tone="dim">{v}</Text>
              </Stack>
            ))}
          </Stack>
        </Spec>
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
            flex, gap and padding only. No margins, no percentages, no grid. A linter enforces it on
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
