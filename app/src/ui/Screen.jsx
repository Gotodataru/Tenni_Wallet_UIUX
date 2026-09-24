import { useContext } from 'react'
import { ScreenDefaults } from './ScreenDefaults.js'
import { StatusBar } from './StatusBar.jsx'
import { HomeIndicator } from './HomeIndicator.jsx'
import './Screen.css'

/**
 * L5 · Screen — the screen frame
 *
 * Sizing contract (Figma):
 *   column · W=fixed(390) H=fixed(844) · radius 44 · clip
 *   ├ StatusBar     fixed(54)
 *   ├ appBar?       fixed(56)   — slot
 *   ├ content       fill · scroll
 *   ├ tabBar?       fixed(64)   — slot
 *   └ HomeIndicator fixed(34)
 *
 * 390×844 — iPhone 14/15/16 logical points. One frame for every screen.
 *
 * ── Four decisions made here once ─────────────────────────────────
 *
 * 1. appBar / tabBar are SLOTS, not booleans.
 *    Every screen has its own AppBar (title, buttons) and its own
 *    active tab. A boolean would force Screen to know both components'
 *    props and pass them through. A slot is an Instance swap property
 *    in Figma — the same pattern as ListRow (leading/trailing), AppBar
 *    and EmptyState. StatusBar and HomeIndicator stay booleans: they
 *    have no variations besides the theme, which Screen already knows.
 *
 * 2. theme sets data-theme ON ITSELF, not on the document.
 *    So one screen can be dark inside a light page and vice versa —
 *    semantic tokens cascade into the subtree (semantic.css selects
 *    [data-theme="…"], not only :root). Without a theme the screen
 *    inherits the app's.
 *
 * 3. Safe areas apply only when the mock bars are OFF.
 *    In the mock frame the StatusBar (54) and HomeIndicator (34) are
 *    the safe areas — adding env(safe-area-inset-*) on top would
 *    double the inset. env() applies only when a mock bar is off,
 *    which means we're on a real device.
 *
 * 4. size: mock | fluid.
 *    The contract describes the mock (390×844, radius 44) — the default.
 *    `fluid` lets the same component be the real app shell (the screen
 *    fills the viewport with no rounded corners) instead of being
 *    rewritten on the first real launch.
 *
 * 5. ScreenDefaults — a context for the app shell.
 *    Screens are built as mocks and don't know where they are shown.
 *    A host that runs them as a real app (the test route) sets size,
 *    mock bars and safe areas once here, instead of every screen
 *    taking three more props. Explicit props still win.
 *
 * ⚠ The phone bezel is NOT part of Screen — the same boundary as Modal
 * without its scrim and CardVisual without the payment composer: the
 * component is the screen, not the device. The catalog draws the bezel.
 */
/* overlay — a slot over the whole screen: scrim + a BottomSheet or Modal
   pinned to the bottom. In Figma: a frame set to Absolute position,
   fill = bg-overlay, the sheet inside at the bottom. */
export function Screen({
  theme,
  size: sizeProp,
  statusBar: statusBarProp,
  statusBarTheme,
  time,
  appBar,
  tabBar,
  homeIndicator: homeIndicatorProp,
  safeTop: safeTopProp,
  scroll = true,
  contentPadding = 0,
  overlay,
  onOverlayClose,
  children,
  className = '',
  ...rest
}) {
  const defaults = useContext(ScreenDefaults)
  const size = sizeProp ?? defaults.size ?? 'mock'
  const statusBar = statusBarProp ?? defaults.statusBar ?? true
  const homeIndicator = homeIndicatorProp ?? defaults.homeIndicator ?? true
  const safeTop = safeTopProp ?? defaults.safeTop ?? false

  const cls = [
    'Screen',
    `Screen--${size}`,
    !statusBar && safeTop && 'Screen--safeTop',
    !homeIndicator && 'Screen--safeBottom',
    className,
  ].filter(Boolean).join(' ')

  // Mock bars follow the screen theme: light on dark, dark on light.
  const barTheme = statusBarTheme || (theme === 'light' ? 'light' : 'dark')

  const contentCls = [
    'Screen__content',
    scroll ? 'Screen__content--scroll' : 'Screen__content--clip',
    contentPadding && `Screen__content--pad-${contentPadding}`,
  ].filter(Boolean).join(' ')

  return (
    <div className={cls} data-theme={theme} {...rest}>
      {statusBar && <StatusBar theme={barTheme} time={time} />}
      {appBar}
      <div className={contentCls}>{children}</div>
      {tabBar}
      {homeIndicator && <HomeIndicator theme={barTheme} />}
      {overlay && (
        // A scrim over the whole screen with the sheet at the bottom.
        // Tapping the scrim (not the sheet) closes it.
        <div className="Screen__overlay" onClick={(e) => e.target === e.currentTarget && onOverlayClose?.()}>
          {overlay}
        </div>
      )}
    </div>
  )
}
