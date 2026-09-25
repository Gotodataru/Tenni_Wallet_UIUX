import { useEffect, useState } from 'react'
import { Stack, Text, Button, Icon } from './ui/index.js'
import { Case } from './pages/Case.jsx'
import { Screens } from './pages/Screens.jsx'
import { Tokens } from './pages/Tokens.jsx'
import { Icons } from './pages/Icons.jsx'
import { Primitives } from './pages/Primitives.jsx'
import { Controls } from './pages/Controls.jsx'
import { Data } from './pages/Data.jsx'
import { Feedback } from './pages/Feedback.jsx'
import { Navigation } from './pages/Navigation.jsx'
import { TestApp } from './pages/TestApp.jsx'
import { ICON_NAMES } from './icons/paths.js'
import './pages/kitchen.css'

const GROUPS = [
  {
    title: 'Product',
    routes: [
      { id: 'case',    label: 'Case study', title: 'Tenni Wallet', icon: 'card', El: Case },
      { id: 'screens', label: 'Screens',    title: 'Screens',      icon: 'scan', El: Screens },
    ],
  },
  {
    title: 'Design system',
    routes: [
      { id: 'tokens',     label: 'Tokens',       icon: 'settings', El: Tokens },
      { id: 'icons',      label: 'Icons',        icon: 'qr',       El: Icons },
      { id: 'primitives', label: 'Primitives',   icon: 'stake',    El: Primitives },
      { id: 'controls',   label: 'Controls',     icon: 'check-circle', El: Controls },
      { id: 'data',       label: 'Data display', icon: 'swap',     El: Data },
      { id: 'feedback',   label: 'Feedback',     icon: 'bell',     El: Feedback },
      { id: 'navigation', label: 'Navigation',   icon: 'home',     El: Navigation },
    ],
  },
]

const ROUTES = GROUPS.flatMap((g) => g.routes)

function useHashRoute(fallback) {
  const [id, setId] = useState(() => window.location.hash.slice(1) || fallback)
  useEffect(() => {
    const onHash = () => {
      setId(window.location.hash.slice(1) || fallback)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [fallback])
  return id
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const host = document.documentElement.getAttribute('data-theme')
    try { return localStorage.getItem('tenni-theme') || host || 'dark' } catch { return host || 'dark' }
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('tenni-theme', theme) } catch { /* private mode */ }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

// #test is the prototype alone, for usability sessions: no catalog around it
export default function App() {
  const routeId = useHashRoute('case')
  return routeId === 'test' ? <TestApp /> : <Catalog routeId={routeId} />
}

function Catalog({ routeId }) {
  const [theme, toggleTheme] = useTheme()
  const route = ROUTES.find((r) => r.id === routeId) || ROUTES[0]
  const El = route.El

  return (
    <div className="Kitchen">
      <nav className="Kitchen__nav">
        <a className="Kitchen__brand" href="#case">
          <div className="Kitchen__logo">TW</div>
          <Stack gap={2}>
            <Text variant="label">Tenni Wallet</Text>
            <Text variant="caption" tone="dim">Case study · Design system</Text>
          </Stack>
        </a>

        {GROUPS.map((g) => (
          <div key={g.title} className="Kitchen__navGroup">
            <span className="Kitchen__navGroupTitle"><Text variant="caption" tone="dim">{g.title}</Text></span>
            {g.routes.map((r) => (
              <a
                key={r.id}
                href={`#${r.id}`}
                className={`Kitchen__link${r.id === route.id ? ' is-active' : ''}`}
                aria-current={r.id === route.id ? 'page' : undefined}
              >
                <Icon name={r.icon} size={20} />
                {r.label}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <main className="Kitchen__main">
        <header className="Kitchen__header">
          <Stack gap={6}>
            <Text variant="h1">{route.title || route.label}</Text>
            <Text variant="bodySm" tone="dim">
              {ICON_NAMES.length} icons · 45 components · 11 screens · built to Figma Auto Layout rules
            </Text>
          </Stack>
          <Button
            variant="secondary"
            size="md"
            iconLeading={theme === 'dark' ? 'sun' : 'moon'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </header>

        <El theme={theme} />
      </main>
    </div>
  )
}
