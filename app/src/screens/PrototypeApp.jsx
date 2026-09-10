import { useState } from 'react'
import { HomeScreen } from './HomeScreen.jsx'
import { PayScreen } from './PayScreen.jsx'
import { SendScreen } from './SendScreen.jsx'
import { ReceiveScreen } from './ReceiveScreen.jsx'
import { ActivityScreen } from './ActivityScreen.jsx'
import { SettingsScreen } from './SettingsScreen.jsx'
import { OnboardingScreen } from './OnboardingScreen.jsx'

/**
 * The clickable prototype: the seven screens wired into one app.
 *
 * Home → Send / Receive (quick actions), Pay (tab or the card's Pay
 * button), Activity (tab or "See all"), More → Settings. Flows opened
 * from Home close back to Home. Log out goes to Onboarding, and the end
 * of Onboarding opens the wallet again — the loop never dead-ends.
 * The Dark theme toggle in Settings switches the whole prototype.
 */

const TAB_ROUTE = { home: 'home', pay: 'pay', activity: 'activity', more: 'settings' }

export function PrototypeApp({ theme: themeProp = 'dark', start = 'home' }) {
  const [route, setRoute] = useState(start)
  const [theme, setTheme] = useState(themeProp)
  const [prevThemeProp, setPrevThemeProp] = useState(themeProp)

  // The catalog's own theme switch still wins when it changes
  // (adjusting state during render, not in an effect).
  if (themeProp !== prevThemeProp) {
    setPrevThemeProp(themeProp)
    setTheme(themeProp)
  }

  const navigate = (id) => setRoute(TAB_ROUTE[id] || id)
  const home = () => setRoute('home')
  const common = { theme, onNavigate: navigate }

  switch (route) {
    case 'pay':        return <PayScreen theme={theme} onExit={home} />
    case 'send':       return <SendScreen theme={theme} onExit={home} />
    case 'receive':    return <ReceiveScreen theme={theme} onExit={home} />
    case 'activity':   return <ActivityScreen {...common} />
    case 'settings':   return <SettingsScreen {...common} onThemeChange={setTheme} onLogout={() => setRoute('onboarding')} />
    case 'onboarding': return <OnboardingScreen theme={theme} onFinish={home} />
    default:           return <HomeScreen {...common} />
  }
}
