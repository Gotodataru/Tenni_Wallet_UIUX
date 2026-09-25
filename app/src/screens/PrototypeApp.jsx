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
import { CARD_LAST4, DEMO_PASSCODE } from './data.js'

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
 * What the flows share lives here: the theme, the passcode the visitor
 * created at sign-up (Unlock checks it) and the card — frozen on Card
 * means frozen on Home and in Pay, and a replaced card has a new number
 * everywhere.
 */

const TAB_ROUTE = { home: 'home', pay: 'pay', activity: 'activity', more: 'settings' }

export function PrototypeApp({ theme: themeProp = 'dark', start = 'home' }) {
  const [route, setRoute] = useState(start)
  const [theme, setTheme] = useState(themeProp)
  const [prevThemeProp, setPrevThemeProp] = useState(themeProp)
  const [passcode, setPasscode] = useState(DEMO_PASSCODE)
  const [frozen, setFrozen] = useState(false)
  const [last4, setLast4] = useState(CARD_LAST4)

  // The catalog's own theme switch still wins when it changes
  // (adjusting state during render, not in an effect).
  if (themeProp !== prevThemeProp) {
    setPrevThemeProp(themeProp)
    setTheme(themeProp)
  }

  const navigate = (id) => setRoute(TAB_ROUTE[id] || id)
  const home = () => setRoute('home')
  const common = { theme, onNavigate: navigate }
  const card = { frozen, last4 }

  switch (route) {
    case 'pay':        return <PayScreen theme={theme} {...card} onUnfreeze={() => setFrozen(false)} onExit={home} />
    case 'send':       return <SendScreen theme={theme} onExit={home} />
    case 'receive':    return <ReceiveScreen theme={theme} onExit={home} />
    case 'activity':   return <ActivityScreen {...common} />
    case 'card':       return <CardScreen theme={theme} {...card} onFreezeChange={setFrozen} onReplaced={setLast4} onExit={home} />
    case 'settings':   return <SettingsScreen {...common} onThemeChange={setTheme} onLogout={() => setRoute('onboarding')} onLock={() => setRoute('unlock')} />
    case 'onboarding': return <OnboardingScreen theme={theme} onFinish={() => setRoute('verify')} onSignIn={() => setRoute('signin')} onPasscode={setPasscode} />
    case 'signin':     return <SignInScreen key="signin" theme={theme} passcode={passcode} onFinish={home} onExit={() => setRoute('onboarding')} onPasscode={setPasscode} />
    case 'reset':      return <SignInScreen key="reset" reset theme={theme} passcode={passcode} onFinish={home} onExit={() => setRoute('unlock')} onPasscode={setPasscode} />
    case 'unlock':     return <UnlockScreen theme={theme} passcode={passcode} onUnlock={home} onForgot={() => setRoute('reset')} />
    case 'verify':     return <VerifyScreen theme={theme} onFinish={() => { setFrozen(false); setLast4(CARD_LAST4); home() }} onExit={home} />
    default:           return <HomeScreen {...common} {...card} />
  }
}
