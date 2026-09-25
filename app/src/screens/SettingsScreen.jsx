import { useState } from 'react'
import {
  Screen, AppBar, TabBar, Icon, Stack, Text, Surface,
  ListRow, Toggle, Chip, Button, EmptyState, Illustration,
} from '../ui/index.js'
import { TABS, USER } from './data.js'
import { UserAvatar } from './UserAvatar.jsx'

/**
 * Settings + Profile — lists on ListRow size="sm" with toggles.
 *
 * Dark theme is a working toggle: it switches the Screen's theme live
 * (in the clickable prototype — the whole prototype). Currency and
 * language cycle through their values on tap.
 *
 * Log out has no confirmation dialog on purpose: the demo has nothing to
 * lose, so it goes straight to a signed-out state with a way back.
 * No screen here shows anything like a recovery phrase or a private key.
 */

const STEPS = ['settings', 'profile']

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED']
const LANGUAGES = ['English', 'Español', 'Deutsch']

function ProfileStep({ user }) {
  return (
    <Stack gap={20} fill>
      <Stack align="center" gap={12}>
        <UserAvatar user={user} size={56} ring />
        <Stack gap={2} align="center">
          <Text variant="h3">{user.name}</Text>
          <Text variant="bodySm" tone="dim">{user.email}</Text>
        </Stack>
        <Button variant="ghost" size="sm" iconLeading="edit">Change photo</Button>
      </Stack>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Personal details</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow size="sm" title="Name" trailing={<Text variant="bodySm" tone="dim">{user.name}</Text>} chevron divider />
          <ListRow size="sm" title="Email" trailing={<Text variant="bodySm" tone="dim">{user.email}</Text>} chevron divider />
          <ListRow size="sm" title="Phone" trailing={<Text variant="bodySm" tone="dim">Not set</Text>} chevron />
        </Surface>
      </Stack>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Wallet</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow
            size="sm"
            leading={<Icon name="shield" size={20} tone="accent" />}
            title="Identity check"
            trailing={<Chip variant="success" size="sm">Verified</Chip>}
          />
        </Surface>
      </Stack>
    </Stack>
  )
}

function LoggedOutStep({ onRestore }) {
  return (
    <Stack fill justify="center" gap={16}>
      <EmptyState
        illustration={<Illustration name="generic" size={112} />}
        title="You're signed out"
        body="This is a concept, so nothing was saved. Sign in again to keep exploring."
        action
        actionLabel="Sign in again"
        onAction={onRestore}
      />
    </Stack>
  )
}

function SettingsStep({
  user,
  faceId, onFaceId, notify, onNotify, darkTheme, onDarkTheme,
  currency, onCycleCurrency, language, onCycleLanguage,
  onOpenProfile, onLogout, onLock,
}) {
  return (
    <Stack gap={20} fill>
      <Surface level={1} radius="lg" pad={0} gap={0}>
        <ListRow
          leading={<UserAvatar user={user} size={40} />}
          title={user.name}
          subtitle={user.email}
          chevron
          onClick={onOpenProfile}
        />
      </Surface>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Security</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow
            size="sm"
            leading={<Icon name="face-id" size={20} tone="dim" />}
            title="Face ID"
            trailing={<Toggle checked={faceId} onChange={onFaceId} aria-label="Face ID" />}
            divider
          />
          <ListRow
            size="sm"
            leading={<Icon name="bell" size={20} tone="dim" />}
            title="Push notifications"
            trailing={<Toggle checked={notify} onChange={onNotify} aria-label="Push notifications" />}
            divider
          />
          <ListRow
            size="sm"
            leading={<Icon name="lock" size={20} tone="dim" />}
            title="Lock the app now"
            chevron
            onClick={onLock}
          />
        </Surface>
      </Stack>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Preferences</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow
            size="sm"
            leading={<Icon name={darkTheme ? 'moon' : 'sun'} size={20} tone="dim" />}
            title="Dark theme"
            trailing={<Toggle checked={darkTheme} onChange={onDarkTheme} aria-label="Dark theme" />}
            divider
          />
          <ListRow
            size="sm"
            leading={<Icon name="card" size={20} tone="dim" />}
            title="Display currency"
            trailing={<Text variant="bodySm" tone="dim">{currency}</Text>}
            chevron
            onClick={onCycleCurrency}
            divider
          />
          <ListRow
            size="sm"
            leading={<Icon name="globe" size={20} tone="dim" />}
            title="Language"
            trailing={<Text variant="bodySm" tone="dim">{language}</Text>}
            chevron
            onClick={onCycleLanguage}
          />
        </Surface>
      </Stack>

      <Stack gap={8}>
        <Text variant="label" tone="dim">Support</Text>
        <Surface level={1} radius="lg" pad={0} gap={0}>
          <ListRow size="sm" leading={<Icon name="help" size={20} tone="dim" />} title="Help & support" chevron divider />
          <ListRow size="sm" leading={<Icon name="info" size={20} tone="dim" />} title="About" trailing={<Text variant="bodySm" tone="dim">v1.0.0</Text>} />
        </Surface>
      </Stack>

      <Stack fill justify="end">
        <Button variant="danger" size="lg" fullWidth iconLeading="logout" onClick={onLogout}>
          Log out
        </Button>
      </Stack>
    </Stack>
  )
}

/**
 * step          — set from outside (the catalog shows both steps statically)
 *                 or driven internally, so the screen works as a live prototype.
 * onThemeChange — when given, the Dark theme toggle controls the parent's
 *                 theme instead of this screen's own.
 * onLogout      — when given, Log out leaves the screen (prototype → onboarding).
 * onLock        — "Lock the app now" (prototype → Unlock).
 * user          — who is signed in.
 */
export function SettingsScreen({ step: stepProp, theme = 'dark', scaled = false, user = USER, onNavigate, onThemeChange, onLogout, onLock }) {
  const [innerStep, setInnerStep] = useState('settings')
  const [faceId, setFaceId] = useState(true)
  const [notify, setNotify] = useState(true)
  const [ownDark, setOwnDark] = useState(theme !== 'light')
  const [currencyIndex, setCurrencyIndex] = useState(0)
  const [languageIndex, setLanguageIndex] = useState(0)
  const [loggedOut, setLoggedOut] = useState(false)
  const step = stepProp || innerStep

  const darkTheme = onThemeChange ? theme !== 'light' : ownDark
  const setDarkTheme = (on) => (onThemeChange ? onThemeChange(on ? 'dark' : 'light') : setOwnDark(on))

  const go = (s) => { if (!stepProp) setInnerStep(s) }

  const appBar = step === 'profile'
    ? <AppBar onBack={() => go('settings')} title="Profile" />
    : <AppBar title="Settings" />

  const tabBar = step === 'settings'
    ? <TabBar items={TABS} active="more" onChange={(id) => id !== 'more' && onNavigate?.(id)} />
    : undefined

  return (
    <Screen
      className={scaled ? 'Device__scaled' : undefined}
      theme={darkTheme ? 'dark' : 'light'}
      appBar={appBar}
      tabBar={tabBar}
      contentPadding={16}
    >
      {step === 'profile' ? (
        <ProfileStep user={user} />
      ) : loggedOut ? (
        <LoggedOutStep onRestore={() => setLoggedOut(false)} />
      ) : (
        <SettingsStep
          user={user}
          faceId={faceId} onFaceId={setFaceId}
          notify={notify} onNotify={setNotify}
          darkTheme={darkTheme} onDarkTheme={setDarkTheme}
          currency={CURRENCIES[currencyIndex]} onCycleCurrency={() => setCurrencyIndex((i) => (i + 1) % CURRENCIES.length)}
          language={LANGUAGES[languageIndex]} onCycleLanguage={() => setLanguageIndex((i) => (i + 1) % LANGUAGES.length)}
          onOpenProfile={() => go('profile')}
          onLogout={() => (onLogout ? onLogout() : setLoggedOut(true))}
          onLock={onLock}
        />
      )}
    </Screen>
  )
}

export { STEPS as SETTINGS_STEPS }
