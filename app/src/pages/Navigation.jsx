import { useState } from 'react'
import {
  StatusBar, AppBar, TabBar, NavItem, HomeIndicator, Screen, Section as UISection,
  IconButton, Avatar, Text, Stack, ListRow, AssetIcon,
} from '../ui/index.js'
import { Section, Spec, Cell } from './parts.jsx'

const TABS = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'pay', icon: 'pay', label: 'Pay' },
  { id: 'swap', icon: 'swap', label: 'Swap', badge: true },
  { id: 'scan', icon: 'scan', label: 'Scan' },
  { id: 'more', icon: 'more', label: 'More' },
]

function StatusBarSection() {
  return (
    <Section title="StatusBar" hint="row · W=fill H=fixed(54) · pad 0/24 · space-between. theme here is not the app theme but a literal color: it must read on any background.">
      <Spec title="dark / light">
        <Cell label="dark" center>
          <div className="Navigation__frameDark"><StatusBar theme="dark" /></div>
        </Cell>
        <Cell label="light" center>
          <div className="Navigation__frameLight"><StatusBar theme="light" /></div>
        </Cell>
      </Spec>
    </Section>
  )
}

function AppBarSection() {
  return (
    <Section title="AppBar" hint="row · W=fill H=fixed(56) · pad 0/16 · gap 12 · center. leading/trailing are slots; onBack is a shortcut for the most common case.">
      <Spec title="title-left, different leading" column>
        <div className="Navigation__barFrame"><AppBar title="Wallet" leading={<Avatar type="initials" initials="NR" size={36} />} trailing={<IconButton variant="ghost" size={32} icon="bell" aria-label="Notifications" />} /></div>
        <div className="Navigation__barFrame"><AppBar title="Activity" onBack={() => {}} trailing={<IconButton variant="ghost" size={32} icon="filter" aria-label="Filter" />} /></div>
      </Spec>

      <Spec title="title-center" column>
        <div className="Navigation__barFrame"><AppBar layout="title-center" title="Send" onBack={() => {}} trailing={<IconButton variant="ghost" size={32} icon="qr" aria-label="QR" />} /></div>
      </Spec>

      <Spec title="transparent, over screen content">
        <div className="Navigation__frameDark">
          <AppBar transparent layout="title-center" title="Details" onBack={() => {}} />
        </div>
      </Spec>
    </Section>
  )
}

function TabBarSection() {
  const [active, setActive] = useState('home')

  return (
    <Section title="TabBar + NavItem" hint="row · W=fill H=fixed(64) · pad 0/8. NavItem: column · W=fill H=fill · gap 4 · center, equal-width tabs.">
      <Spec title="Live example" column>
        <div className="Navigation__barFrame">
          <TabBar items={TABS} active={active} onChange={setActive} />
        </div>
        <Text variant="bodySm" tone="dim">active tab: {active}</Text>
      </Spec>

      <Spec title="theme floating (default) / solid / glass">
        <Cell label="solid" center>
          <div className="Navigation__barFrame"><TabBar items={TABS} active="home" theme="solid" onChange={() => {}} /></div>
        </Cell>
        <Cell label="glass, over content" center>
          <div className="Navigation__frameDark">
            <TabBar items={TABS} active="pay" theme="glass" onChange={() => {}} />
          </div>
        </Cell>
      </Spec>

      <Spec title="labels=false, icons only">
        <div className="Navigation__barFrame"><TabBar items={TABS} active="scan" labels={false} onChange={() => {}} /></div>
      </Spec>

      <Spec title="NavItem states">
        <Cell label="default" center><div style={{ width: 64, height: 56, display: 'flex' }}><NavItem icon="home" label="Home" /></div></Cell>
        <Cell label="active" center><div style={{ width: 64, height: 56, display: 'flex' }}><NavItem icon="home" label="Home" state="active" /></div></Cell>
        <Cell label="disabled" center><div style={{ width: 64, height: 56, display: 'flex' }}><NavItem icon="home" label="Home" state="disabled" /></div></Cell>
        <Cell label="badge" center><div style={{ width: 64, height: 56, display: 'flex' }}><NavItem icon="swap" label="Swap" badge /></div></Cell>
      </Spec>
    </Section>
  )
}

function HomeIndicatorSection() {
  return (
    <Section title="HomeIndicator" hint="row · W=fill H=fixed(34) · center. Same literal-color approach as StatusBar.">
      <Spec title="dark / light">
        <Cell label="dark" center>
          <div className="Navigation__frameDark"><HomeIndicator theme="dark" /></div>
        </Cell>
        <Cell label="light" center>
          <div className="Navigation__frameLight"><HomeIndicator theme="light" /></div>
        </Cell>
      </Spec>
    </Section>
  )
}

function SectionCompSection() {
  return (
    <Section title="Section (screen component)" hint="column · W=fill H=hug · gap 12 · header space-between (Text/h3 + Button/ghost).">
      <Spec title="With a title and an action" column>
        <UISection title="Activity" action actionLabel="See all" onAction={() => {}}>
          <ListRow leading={<AssetIcon symbol="btc" size={40} />} title="Bitcoin" subtitle="Today · 10:30" divider />
          <ListRow leading={<AssetIcon symbol="eth" size={40} />} title="Ethereum" subtitle="Yesterday · 18:45" />
        </UISection>
      </Spec>

      <Spec title="No action, padding=16" column>
        <UISection title="Quick actions" padding={16}>
          <Text variant="bodySm" tone="dim">content: any children, placeholder text here</Text>
        </UISection>
      </Spec>
    </Section>
  )
}

function ScreenSection() {
  const [active, setActive] = useState('home')

  const appBar = (
    <AppBar
      title="Wallet"
      leading={<Avatar type="initials" initials="NR" size={36} />}
      trailing={<IconButton variant="ghost" size={32} icon="bell" aria-label="Notifications" />}
    />
  )
  const tabBar = <TabBar items={TABS} active={active} onChange={setActive} />

  return (
    <Section
      title="Screen"
      hint="column · W=fixed(390) H=fixed(844) · radius 44 · clip. One frame for every screen of the product."
    >
      <Spec title="Four decisions in the contract" column>
        <Text variant="bodySm" tone="dim">
          <b>1.</b> <code>appBar</code>/<code>tabBar</code> are slots, not booleans: every screen has its
          own title and its own active tab. <b>2.</b> <code>theme</code> sets <code>data-theme</code> on
          the screen itself, so a dark screen can live inside a light page (see below). <b>3.</b> Safe
          areas apply only when the mock bars are off, otherwise the inset would double. <b>4.</b>
          <code> size=fluid</code> lets the same component be the real app shell, not just a mockup.
        </Text>
      </Spec>

      <Spec title="Live example: the full frame" contract="statusBar + appBar + content (scroll) + tabBar + homeIndicator">
        <div className="Device">
          <Screen theme="dark" appBar={appBar} tabBar={tabBar} contentPadding={16}>
            <Stack gap={12} style={{ paddingTop: 'var(--space-16)' }}>
              <Text variant="bodySm" tone="faint">
                Content scrolls while StatusBar, AppBar, TabBar and HomeIndicator stay in place.
              </Text>
              {Array.from({ length: 12 }, (_, i) => (
                <ListRow
                  key={i}
                  leading={<AssetIcon symbol={['btc', 'eth', 'usdt', 'sol'][i % 4]} size={40} />}
                  title={`List row ${i + 1}`}
                  subtitle="scroll check"
                  divider={i < 11}
                />
              ))}
            </Stack>
          </Screen>
        </div>
      </Spec>

      <Spec title="theme: the screen carries its own theme" contract="data-theme is set on Screen, not on the document">
        <Cell label="theme=dark" center>
          <div className="Device--sm">
            <Screen className="Device__scaled" theme="dark" appBar={<AppBar title="Dark" onBack={() => {}} />} tabBar={tabBar} contentPadding={16} />
          </div>
        </Cell>
        <Cell label="theme=light" center>
          <div className="Device--sm">
            <Screen className="Device__scaled" theme="light" appBar={<AppBar title="Light" onBack={() => {}} />} tabBar={tabBar} contentPadding={16} />
          </div>
        </Cell>
      </Spec>

      <Spec title="No TabBar / no bars" contract="slot not passed, the block is simply absent">
        <Cell label="no tabBar" center>
          <div className="Device--sm">
            <Screen className="Device__scaled" theme="dark" appBar={<AppBar title="Details" onBack={() => {}} />} contentPadding={16} />
          </div>
        </Cell>
        <Cell label="content only" center>
          <div className="Device--sm">
            <Screen className="Device__scaled" theme="dark" statusBar={false} homeIndicator={false} contentPadding={16} />
          </div>
        </Cell>
      </Spec>
    </Section>
  )
}

export function Navigation() {
  return (
    <>
      <StatusBarSection />
      <AppBarSection />
      <TabBarSection />
      <HomeIndicatorSection />
      <SectionCompSection />
      <ScreenSection />
    </>
  )
}
