import { useState } from 'react'
import { HomeScreen } from './HomeScreen.jsx'
import { PayScreen } from './PayScreen.jsx'
import { SendScreen } from './SendScreen.jsx'
import { ReceiveScreen } from './ReceiveScreen.jsx'
import { ActivityScreen } from './ActivityScreen.jsx'
import { SettingsScreen } from './SettingsScreen.jsx'
import { OnboardingScreen } from './OnboardingScreen.jsx'
import { SignInScreen } from './SignInScreen.jsx'
import { UnlockScreen } from './UnlockScreen.jsx'
import { VerifyScreen } from './VerifyScreen.jsx'
import { CardScreen } from './CardScreen.jsx'
import { USER, CARD_LAST4, CARD_EXPIRY, DEMO_PASSCODE, makeUser } from './data.js'

/**
 * The clickable prototype: every screen wired into one app.
 *
 * Home → Send / Receive (quick actions), Pay (tab or the Pay button),
 * Activity (tab or "See all"), Card (tap the card), More → Settings.
 * Flows opened from Home close back to Home.
 *
 * Signed out and back in: Log out → Onboarding (sign-up) → Verify →
 * Home, or "I already have an account" → Sign in → Home. "Lock the app
 * now" in Settings → Unlock; "Forgot passcode?" there → Sign in, reset.
 * The loop never dead-ends.
 *
 * What the flows share lives here: the theme, the account (the email from
 * sign-up, the name from the identity check), the passcode the visitor
 * created (Unlock checks it), the coin a tap spends (picked in Pay, shown
 * on Home) and the card — frozen on Card means frozen
 * on Home and in Pay, and a replaced card has a new number and expiry
 * everywhere.
 */

const TAB_ROUTE = { home: 'home', pay: 'pay', activity: 'activity', more: 'settings' }

export function PrototypeApp({ theme: themeProp = 'dark', start = 'home' }) {
  const [route, setRoute] = useState(start)
  const [theme, setTheme] = useState(themeProp)
  const [prevThemeProp, setPrevThemeProp] = useState(themeProp)
  const [passcode, setPasscode] = useState(DEMO_PASSCODE)
  const [frozen, setFrozen] = useState(false)
  const [payWith, setPayWith] = useState('eth')
  const [card, setCard] = useState({ last4: CARD_LAST4, expiry: CARD_EXPIRY })
  const [account, setAccount] = useState({ name: USER.name, email: USER.email })
  const user = makeUser(account)

  // The catalog's own theme switch still wins when it changes
  // (adjusting state during render, not in an effect).
  if (themeProp !== prevThemeProp) {
    setPrevThemeProp(themeProp)
    setTheme(themeProp)
  }

  const navigate = (id) => setRoute(TAB_ROUTE[id] || id)
  const home = () => setRoute('home')
  const common = { theme, user, onNavigate: navigate }
  const cardProps = { frozen, ...card }

  switch (route) {
    case 'pay':        return <PayScreen theme={theme} asset={payWith} onAssetChange={setPayWith} frozen={frozen} last4={card.last4} onUnfreeze={() => setFrozen(false)} onExit={home} />
    case 'send':       return <SendScreen theme={theme} onExit={home} />
    case 'receive':    return <ReceiveScreen theme={theme} onExit={home} />
    case 'activity':   return <ActivityScreen {...common} />
    case 'card':       return <CardScreen theme={theme} user={user} {...cardProps} onFreezeChange={setFrozen} onReplaced={(last4, expiry) => setCard({ last4, expiry })} onExit={home} />
    case 'settings':   return <SettingsScreen {...common} onThemeChange={setTheme} onLogout={() => setRoute('onboarding')} onLock={() => setRoute('unlock')} />
    case 'onboarding': return <OnboardingScreen theme={theme} onFinish={() => setRoute('verify')} onSignIn={() => setRoute('signin')} onPasscode={setPasscode} onEmail={(email) => setAccount((a) => ({ ...a, email }))} />
    case 'signin':     return <SignInScreen key="signin" theme={theme} user={user} passcode={passcode} onFinish={(email) => { setAccount((a) => ({ ...a, email })); home() }} onExit={() => setRoute('onboarding')} onPasscode={setPasscode} />
    case 'reset':      return <SignInScreen key="reset" reset theme={theme} user={user} passcode={passcode} onFinish={home} onExit={() => setRoute('unlock')} onPasscode={setPasscode} />
    case 'unlock':     return <UnlockScreen theme={theme} user={user} passcode={passcode} onUnlock={home} onForgot={() => setRoute('reset')} />
    case 'verify':     return <VerifyScreen theme={theme} onFinish={(d) => { setFrozen(false); setCard({ last4: CARD_LAST4, expiry: CARD_EXPIRY }); setAccount((a) => ({ ...a, name: `${d.first.trim()} ${d.last.trim()}` })); home() }} onExit={home} />
    default:           return <HomeScreen {...common} {...cardProps} payWith={payWith} />
  }
}
