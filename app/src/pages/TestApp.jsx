import { useEffect, useState } from 'react'
import { ScreenDefaults } from '../ui/index.js'
import { PrototypeApp } from '../screens/PrototypeApp.jsx'
import './test.css'

const PHONE = '(max-width: 500px)'

/* On a phone the app fills the viewport: no mock status bar or home
   indicator, the device's own safe areas instead. */
const PHONE_SHELL = { size: 'fluid', statusBar: false, homeIndicator: false, safeTop: true }

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return match
}

/**
 * #test — the prototype alone, for usability sessions.
 * No catalog, no "Try this" hints, no links out: a participant sees
 * only the app. Reload the page to reset it between participants.
 */
export function TestApp() {
  const phone = useMedia(PHONE)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.title = 'Tenni Wallet'
  }, [])

  if (phone) {
    return (
      <div className="TestApp TestApp--phone">
        <ScreenDefaults.Provider value={PHONE_SHELL}>
          <PrototypeApp theme="dark" />
        </ScreenDefaults.Provider>
      </div>
    )
  }

  return (
    <div className="TestApp">
      <div className="Device TestApp__device">
        <PrototypeApp theme="dark" />
      </div>
    </div>
  )
}
