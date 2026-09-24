/**
 * L0 · ICON LIBRARY
 *
 * One geometry: 24×24 viewBox, 20×20 live area (2px inset),
 * stroke var(--icon-stroke) = 1.75, round caps/joins, currentColor.
 *
 * Entry format:
 *   'name': { pack, d }          — a single stroked path
 *   'name': { pack, el: [...] }  — several elements
 *   'name': { pack, fill: true } — filled instead of stroked (asset brands)
 *
 * ⚠ Visa / Mastercard / Apple Pay logos are left out ON PURPOSE:
 *   they are registered trademarks and can't be redrawn by hand.
 *   Official assets come from each company's brand center.
 *   The pack uses neutral chip / contactless / nfc marks instead.
 */

export const PACKS = ['navigation', 'wallet', 'status', 'security', 'settings', 'assets']

export const ICONS = {
  /* ==================== NAVIGATION (12) ==================== */
  home:          { pack: 'navigation', d: 'M3.5 10.6 12 3.8l8.5 6.8V19a2 2 0 0 1-2 2h-3.2v-6.2H8.7V21H5.5a2 2 0 0 1-2-2v-8.4Z' },
  card:          { pack: 'navigation', el: [['rect', { x: 3, y: 5.5, width: 18, height: 13, rx: 2.5 }], ['path', { d: 'M3 10h18M6.5 14.5h3.5' }]] },
  swap:          { pack: 'navigation', d: 'M6 8.5h13l-3.6-3.6M18 15.5H5l3.6 3.6' },
  scan:          { pack: 'navigation', d: 'M4 9V6.5A2.5 2.5 0 0 1 6.5 4H9M15 4h2.5A2.5 2.5 0 0 1 20 6.5V9M20 15v2.5a2.5 2.5 0 0 1-2.5 2.5H15M9 20H6.5A2.5 2.5 0 0 1 4 17.5V15M3.5 12h17' },
  more:          { pack: 'navigation', el: [['circle', { cx: 5, cy: 12, r: 1.6, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 12, cy: 12, r: 1.6, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 19, cy: 12, r: 1.6, fill: 'currentColor', stroke: 'none' }]] },
  menu:          { pack: 'navigation', d: 'M4 7h16M4 12h16M4 17h16' },
  close:         { pack: 'navigation', d: 'M6.5 6.5l11 11M17.5 6.5l-11 11' },
  'chevron-left':  { pack: 'navigation', d: 'M14.5 5.5 8 12l6.5 6.5' },
  'chevron-right': { pack: 'navigation', d: 'M9.5 5.5 16 12l-6.5 6.5' },
  'chevron-up':    { pack: 'navigation', d: 'M5.5 14.5 12 8l6.5 6.5' },
  'chevron-down':  { pack: 'navigation', d: 'M5.5 9.5 12 16l6.5-6.5' },
  'arrow-left':    { pack: 'navigation', d: 'M20 12H4m6-6-6 6 6 6' },
  'arrow-right':   { pack: 'navigation', d: 'M4 12h16m-6-6 6 6-6 6' },
  'arrow-up':      { pack: 'navigation', d: 'M12 20V4m-6 6 6-6 6 6' },
  'arrow-down':    { pack: 'navigation', d: 'M12 4v16m6-6-6 6-6-6' },

  /* ==================== WALLET (15) ==================== */
  send:      { pack: 'wallet', d: 'M7 17 17 7M8.5 7H17v8.5' },
  receive:   { pack: 'wallet', d: 'M17 7 7 17M15.5 17H7V8.5' },
  buy:       { pack: 'wallet', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 8v8M8 12h8' }]] },
  stake:     { pack: 'wallet', d: 'M12 3.2 3.5 7.6 12 12l8.5-4.4L12 3.2ZM3.5 12 12 16.4 20.5 12M3.5 16.4 12 20.8l8.5-4.4' },
  pay:       { pack: 'wallet', el: [['rect', { x: 2.5, y: 6, width: 14, height: 12, rx: 2.5 }], ['path', { d: 'M2.5 10h14M19 9.2a4 4 0 0 1 0 5.6M21.3 7.2a7 7 0 0 1 0 9.6' }]] },
  // Spending categories for merchants in Activity — generic objects, never brand logos
  coffee:    { pack: 'wallet', el: [['path', { d: 'M5 9h11v4.5a5.5 5.5 0 0 1-5.5 5.5A5.5 5.5 0 0 1 5 13.5V9Z' }], ['path', { d: 'M16 10.5h1.2a2.3 2.3 0 0 1 0 4.6H16M8.5 3.5V6M12.5 3.5V6' }]] },
  car:       { pack: 'wallet', el: [['path', { d: 'M4.5 13 6.4 8a2 2 0 0 1 1.9-1.3h7.4A2 2 0 0 1 17.6 8l1.9 5' }], ['rect', { x: 3.5, y: 13, width: 17, height: 4.5, rx: 1.5 }], ['path', { d: 'M7 17.5V20M17 17.5V20' }]] },
  tv:        { pack: 'wallet', el: [['rect', { x: 3, y: 6.5, width: 18, height: 12, rx: 2.5 }], ['path', { d: 'M9 3.5l3 3 3-3M10.5 10v5l4-2.5-4-2.5Z' }]] },
  briefcase: { pack: 'wallet', el: [['rect', { x: 3.5, y: 7.5, width: 17, height: 12, rx: 2.5 }], ['path', { d: 'M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17' }]] },
  qr:        { pack: 'wallet', el: [['rect', { x: 3.5, y: 3.5, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13.5, y: 3.5, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 3.5, y: 13.5, width: 7, height: 7, rx: 1.5 }], ['path', { d: 'M13.5 13.5h3v3h-3zM20.5 20.5h-3v-3' }]] },
  copy:      { pack: 'wallet', el: [['rect', { x: 8.5, y: 8.5, width: 12, height: 12, rx: 2.5 }], ['path', { d: 'M5.5 15.5h-.5a1.5 1.5 0 0 1-1.5-1.5V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 15.5 5v.5' }]] },
  share:     { pack: 'wallet', d: 'M12 15.5V3.5m0 0L8.2 7.3M12 3.5l3.8 3.8M4.5 13.5V19a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5.5' },
  eye:       { pack: 'wallet', el: [['path', { d: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z' }], ['circle', { cx: 12, cy: 12, r: 3 }]] },
  'eye-off': { pack: 'wallet', d: 'M4 4l16 16M9.9 9.9A3 3 0 0 0 14.1 14.1M6.3 6.6C4 8.2 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.7 0 3.2-.5 4.5-1.2M18.4 15.1c1.9-1.6 3.1-3.1 3.1-3.1S18 5.5 12 5.5c-.8 0-1.6.1-2.3.3' },
  plus:      { pack: 'wallet', d: 'M12 4.5v15M4.5 12h15' },
  minus:     { pack: 'wallet', d: 'M4.5 12h15' },
  filter:    { pack: 'wallet', d: 'M4 6.5h16M7 12h10M10 17.5h4' },
  search:    { pack: 'wallet', el: [['circle', { cx: 11, cy: 11, r: 6.5 }], ['path', { d: 'M15.8 15.8 20.5 20.5' }]] },
  refresh:   { pack: 'wallet', d: 'M20.5 12a8.5 8.5 0 1 1-2.5-6M20.5 3.5v5h-5' },

  /* ==================== STATUS (11) ==================== */
  check:            { pack: 'status', d: 'M5 12.5 9.5 17 19 7' },
  'check-circle':   { pack: 'status', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M8 12.2 10.8 15 16 9.5' }]] },
  'alert-triangle': { pack: 'status', el: [['path', { d: 'M12 3.8 2.9 19.5a1 1 0 0 0 .9 1.5h16.4a1 1 0 0 0 .9-1.5L12 3.8Z' }], ['path', { d: 'M12 9.5v4.2' }], ['circle', { cx: 12, cy: 17.2, r: 0.9, fill: 'currentColor', stroke: 'none' }]] },
  'alert-circle':   { pack: 'status', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 7.5v5' }], ['circle', { cx: 12, cy: 16.3, r: 0.9, fill: 'currentColor', stroke: 'none' }]] },
  info:             { pack: 'status', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 11v5.5' }], ['circle', { cx: 12, cy: 7.7, r: 0.9, fill: 'currentColor', stroke: 'none' }]] },
  clock:            { pack: 'status', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 7v5.2l3.2 2' }]] },
  spinner:          { pack: 'status', d: 'M12 3.5a8.5 8.5 0 1 0 8.5 8.5' },
  'x-circle':       { pack: 'status', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6' }]] },
  shield:           { pack: 'status', d: 'M12 3.2 5 6.2v5.6c0 4 2.8 7.6 7 9.1 4.2-1.5 7-5.1 7-9.1V6.2l-7-3Z' },
  lock:             { pack: 'status', el: [['rect', { x: 4.5, y: 10.5, width: 15, height: 10, rx: 2.5 }], ['path', { d: 'M8 10.5V7.8a4 4 0 0 1 8 0v2.7' }]] },
  unlock:           { pack: 'status', el: [['rect', { x: 4.5, y: 10.5, width: 15, height: 10, rx: 2.5 }], ['path', { d: 'M8 10.5V7.8a4 4 0 0 1 7.4-2.1' }]] },

  /* ==================== SECURITY (5) ==================== */
  'face-id': { pack: 'security', d: 'M4 8.5V6.5A2.5 2.5 0 0 1 6.5 4h2M15.5 4h2A2.5 2.5 0 0 1 20 6.5v2M20 15.5v2a2.5 2.5 0 0 1-2.5 2.5h-2M8.5 20h-2A2.5 2.5 0 0 1 4 17.5v-2M9 10v1.5M15 10v1.5M12 10v3.5h-1M9.5 16a3.5 3.5 0 0 0 5 0' },
  'touch-id': { pack: 'security', d: 'M12 4.5a7.5 7.5 0 0 0-7.5 7.5v2M19.5 12a7.5 7.5 0 0 0-3.6-6.4M8.5 19.4A7.5 7.5 0 0 1 8 12a4 4 0 0 1 8 0v2.5M19.4 16.5a7.6 7.6 0 0 1-.9 2.4M12 12v3a4 4 0 0 0 1.2 2.9M15.6 20.3a7.6 7.6 0 0 0 1.5-1.6' },
  pin:       { pack: 'security', el: [['rect', { x: 3.5, y: 4.5, width: 17, height: 15, rx: 2.5 }], ['circle', { cx: 8.5, cy: 10, r: 1.2, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 12, cy: 10, r: 1.2, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 15.5, cy: 10, r: 1.2, fill: 'currentColor', stroke: 'none' }], ['path', { d: 'M8.5 14.5h7' }]] },
  key:       { pack: 'security', el: [['circle', { cx: 8, cy: 8, r: 4 }], ['path', { d: 'M10.9 10.9 20 20M17 17l-2 2M14 14l-2 2' }]] },
  seed:      { pack: 'security', d: 'M12 21c0-5 3-9 8-10-1 5-3.5 8-8 10ZM12 21c0-5-3-9-8-10 1 5 3.5 8 8 10ZM12 21v-6.5' },

  /* ==================== SETTINGS (10) ==================== */
  settings: { pack: 'settings', el: [['circle', { cx: 12, cy: 12, r: 3.2 }], ['path', { d: 'M12 2.5v2.8M12 18.7v2.8M21.5 12h-2.8M5.3 12H2.5M18.7 5.3l-2 2M7.3 16.7l-2 2M18.7 18.7l-2-2M7.3 7.3l-2-2' }]] },
  bell:     { pack: 'settings', d: 'M18 9.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15.5 18 9.5ZM10.2 20.5a2.2 2.2 0 0 0 3.6 0' },
  globe:    { pack: 'settings', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M3.5 12h17M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z' }]] },
  moon:     { pack: 'settings', d: 'M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.5 6.5 0 0 0 9.7 9.7Z' },
  sun:      { pack: 'settings', el: [['circle', { cx: 12, cy: 12, r: 4 }], ['path', { d: 'M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5M18.7 18.7l-1.5-1.5M6.8 6.8 5.3 5.3' }]] },
  user:     { pack: 'settings', el: [['circle', { cx: 12, cy: 8.5, r: 4 }], ['path', { d: 'M4.5 20.5a7.5 7.5 0 0 1 15 0' }]] },
  help:     { pack: 'settings', el: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M9.5 9.6a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.6' }], ['circle', { cx: 12, cy: 16.8, r: 0.9, fill: 'currentColor', stroke: 'none' }]] },
  logout:   { pack: 'settings', d: 'M15.5 16.5 20 12l-4.5-4.5M20 12H9M13 3.5H6.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2H13' },
  trash:    { pack: 'settings', d: 'M4 6.5h16M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5M6.5 6.5l.9 13.1a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-13.1M10 10.5v6M14 10.5v6' },
  edit:     { pack: 'settings', d: 'M4 20h4L19.3 8.7a2.1 2.1 0 0 0-3-3L5 17v3ZM15.5 6.5l3 3' },

  /* ==================== ASSETS (8, filled) ==================== */
  btc:  { pack: 'assets', fill: true, d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.6 8.6c-.2.9-.8 1.3-1.6 1.4.9.2 1.4.9 1.3 2-.2 1.4-1.2 2-2.8 2.1v1.7h-1.2v-1.6h-1v1.6H9.1v-1.7H7v-1.3h.6c.4 0 .5-.2.5-.5V9.3c0-.4-.2-.6-.6-.6H7V7.4h2.1V5.8h1.2v1.5h1V5.8h1.2v1.6c1.5.1 2.4.7 2.5 1.9Zm-4.5.9h1.1c.7 0 1.2-.3 1.2-.9s-.4-.9-1.2-.9h-1.1v1.8Zm0 3.4h1.4c.8 0 1.3-.3 1.3-1s-.5-1-1.3-1h-1.4v2Z' },
  eth:  { pack: 'assets', fill: true, d: 'M12 2.5 5.6 12.4 12 16.1l6.4-3.7L12 2.5ZM5.6 13.7 12 22l6.4-8.3L12 17.4l-6.4-3.7Z' },
  usdt: { pack: 'assets', fill: true, d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM6.8 7.3h10.4v2.4h-3.9v1.1c2.6.1 4.6.6 4.6 1.3 0 .7-2.2 1.3-5 1.3s-5-.6-5-1.3c0-.6 1.9-1.2 4.4-1.3v-1.1H6.8V7.3Zm5.2 6.9c2.9 0 5.3-.5 5.9-1.2v.9c0 .9-2.6 1.6-5.9 1.6s-5.9-.7-5.9-1.6V13c.6.7 3 1.2 5.9 1.2Zm-1.2 1.9h2.4v1.9h-2.4v-1.9Z' },
  sol:  { pack: 'assets', fill: true, d: 'M6.4 15.6a.7.7 0 0 1 .5-.2h13.2c.4 0 .6.5.3.8l-2.8 2.8a.7.7 0 0 1-.5.2H3.9c-.4 0-.6-.5-.3-.8l2.8-2.8ZM6.4 5.2a.7.7 0 0 1 .5-.2h13.2c.4 0 .6.5.3.8l-2.8 2.8a.7.7 0 0 1-.5.2H3.9c-.4 0-.6-.5-.3-.8l2.8-2.8ZM17.6 10.4a.7.7 0 0 0-.5-.2H3.9c-.4 0-.6.5-.3.8l2.8 2.8c.1.1.3.2.5.2h13.2c.4 0 .6-.5.3-.8l-2.8-2.8Z' },
  bnb:  { pack: 'assets', fill: true, d: 'M12 2.5 8.1 6.4l1.9 1.9L12 6.3l2 2 1.9-1.9L12 2.5ZM5.6 8.9 3.7 10.8l1.9 1.9 1.9-1.9-1.9-1.9Zm12.8 0-1.9 1.9 1.9 1.9 1.9-1.9-1.9-1.9ZM12 9.6l-2.4 2.4 2.4 2.4 2.4-2.4L12 9.6Zm-3.9 3.7-1.9 1.9L12 21.5l5.8-6.3-1.9-1.9-2 2-1.9 1.9-1.9-1.9-2-2Z' },
  chip: { pack: 'assets', el: [['rect', { x: 4, y: 6.5, width: 16, height: 11, rx: 2.5 }], ['path', { d: 'M9 6.5v11M15 6.5v11M4 10.5h5M15 10.5h5M4 13.5h5M15 13.5h5' }]] },
  contactless: { pack: 'assets', d: 'M8.5 8.2a5.5 5.5 0 0 1 0 7.6M12 5.6a9 9 0 0 1 0 12.8M15.5 3a12.5 12.5 0 0 1 0 18' },
  nfc:  { pack: 'assets', el: [['rect', { x: 3.5, y: 3.5, width: 17, height: 17, rx: 4 }], ['path', { d: 'M9 15V9.5c0-1.7 1.3-3 3-3s3 1.3 3 3M12 9.5V15' }]] },
}

/** All icon names, grouped by pack. */
export const byPack = () =>
  PACKS.map((pack) => ({
    pack,
    names: Object.keys(ICONS).filter((n) => ICONS[n].pack === pack),
  }))

/* Filled twins of the tab icons: the active tab shows the filled one,
   the way iOS marks where you are. Named <icon>-fill; NavItem picks the
   twin up automatically when it exists. */
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 'var(--icon-stroke)', strokeLinecap: 'round', strokeLinejoin: 'round' }
ICONS['home-fill'] = { pack: 'navigation', fill: true, d: 'M3.5 10.6 12 3.8l8.5 6.8V19a2 2 0 0 1-2 2h-3.2v-6.2H8.7V21H5.5a2 2 0 0 1-2-2v-8.4Z' }
ICONS['pay-fill'] = { pack: 'navigation', fill: true, el: [
  ['path', { fillRule: 'evenodd', d: 'M5 6h9a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 14 18H5a2.5 2.5 0 0 1-2.5-2.5v-7A2.5 2.5 0 0 1 5 6Zm-2.5 3.2h14v1.6h-14Z' }],
  ['path', { ...STROKE, d: 'M19 9.2a4 4 0 0 1 0 5.6M21.3 7.2a7 7 0 0 1 0 9.6' }],
] }
ICONS['clock-fill'] = { pack: 'navigation', fill: true, el: [
  ['path', { fillRule: 'evenodd', d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-1 4h2v4.75l2.7 1.7-1.06 1.7L11 12.85Z' }],
] }

export const ICON_NAMES = Object.keys(ICONS)
