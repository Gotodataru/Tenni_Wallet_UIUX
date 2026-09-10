import './StatusBar.css'

/**
 * L5 · StatusBar (iOS mock)
 *
 * Sizing contract (Figma): row · W=fill H=fixed(54) · pad 0/24 · space-between
 * props: theme (dark|light), time (string)
 *
 * `theme` here is NOT the app theme but a literal color: the status
 * bar must read on whatever is behind it (a photo, a card, a
 * gradient), not on the semantic --fg-default. So this is the one
 * component that uses var(--c-white)/var(--c-ink) directly instead
 * of --fg-*.
 */
export function StatusBar({ theme = 'dark', time = '9:41', className = '', ...rest }) {
  const cls = ['StatusBar', `StatusBar--${theme}`, className].filter(Boolean).join(' ')

  return (
    <div className={cls} {...rest}>
      <span className="StatusBar__time">{time}</span>
      <div className="StatusBar__icons">
        <svg viewBox="0 0 18 12" width="18" height="12" fill="none" aria-hidden="true">
          <path d="M1 11h2V8H1v3zm4 0h2V5H5v6zm4 0h2V2H9v9zm4 0h2V0h-2v11z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 16 12" width="16" height="12" fill="none" aria-hidden="true">
          <path d="M8 2.4c2.1 0 4 .8 5.5 2.1l1.4-1.4A10 10 0 0 0 8 0 10 10 0 0 0 1.1 3.1l1.4 1.4A8 8 0 0 1 8 2.4zm0 4a4 4 0 0 1 2.8 1.2l1.4-1.4A6 6 0 0 0 8 4a6 6 0 0 0-4.2 1.8l1.4 1.4A4 4 0 0 1 8 6.4zm0 4 2-2-2-2-2 2 2 2z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 26 12" width="26" height="12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
          <rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
